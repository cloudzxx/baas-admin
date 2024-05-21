import json
import logging

import docker
from web3 import Web3

from contract.models import FiscoContract

LOG = logging.getLogger(__name__)

FISCO_ACCOUNT_ADDRESS = "0x"
FISCO_ACCOUNT_KEY = "0x"


def _get_node_rpc_url(node_name: str) -> str:
    client = docker.DockerClient("unix:///var/run/docker.sock")
    try:
        container = client.containers.get(node_name)
        ip = container.attrs["NetworkSettings"]["IPAddress"]
        if not ip or ip.startswith("0.0.0"):
            networks = container.attrs["NetworkSettings"]["Networks"]
            for net in networks.values():
                if net.get("IPAddress"):
                    ip = net["IPAddress"]
                    break
        return f"http://{ip}:8545"
    except docker.errors.NotFound:
        return f"http://{node_name}:8545"


def _get_w3(node_name: str) -> Web3:
    rpc_url = _get_node_rpc_url(node_name)
    return Web3(Web3.HTTPProvider(rpc_url))


def deploy_contract(node_name: str, name: str, bytecode: str, abi: str = "", constructor_args: list | None = None) -> FiscoContract:
    w3 = _get_w3(node_name)
    account = w3.eth.account.from_key(FISCO_ACCOUNT_KEY)
    contract = w3.eth.contract(abi=abi or "[]", bytecode=bytecode)
    tx = contract.constructor(*(constructor_args or [])).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "gas": 3000000,
        "gasPrice": w3.eth.gas_price,
    })
    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    if not receipt.contractAddress:
        raise RuntimeError("Contract deployment failed: no contract address in receipt")

    obj = FiscoContract(
        address=receipt.contractAddress,
        name=name,
        abi=abi,
        bytecode=bytecode,
        owner=account.address,
        node_name=node_name,
    )
    obj.save()
    return obj


def call_contract(node_name: str, address: str, abi: str, function_name: str, args: list | None = None, is_write: bool = False) -> dict:
    w3 = _get_w3(node_name)
    abi_data = json.loads(abi)
    contract = w3.eth.contract(address=address, abi=abi_data)
    func = contract.get_function_by_name(function_name)

    if is_write:
        account = w3.eth.account.from_key(FISCO_ACCOUNT_KEY)
        tx = func(* (args or [])).build_transaction({
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address),
            "gas": 3000000,
            "gasPrice": w3.eth.gas_price,
        })
        signed = account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return {"tx_hash": tx_hash.hex(), "status": receipt["status"]}
    else:
        result = func(* (args or [])).call()
        return {"result": str(result)}


def list_contracts(node_name: str | None = None) -> list[FiscoContract]:
    qs = FiscoContract.objects.all()
    if node_name:
        qs = qs.filter(node_name=node_name)
    return list(qs)
