import logging

import requests
from urllib.parse import urljoin

LOG = logging.getLogger(__name__)


def _agent_url(organization) -> str:
    if not organization.agent_url:
        raise ValueError("Organization has no agent URL configured")
    return organization.agent_url.rstrip("/")


def deploy_contract(organization, node_name: str, name: str, bytecode: str, abi: str = "", constructor_args: list | None = None) -> dict:
    resp = requests.post(
        urljoin(_agent_url(organization), "api/contracts"),
        json={
            "node_name": node_name,
            "name": name,
            "bytecode": bytecode,
            "abi": abi,
            "constructor_args": constructor_args or [],
        },
    )
    resp.raise_for_status()
    return resp.json()


def call_contract(organization, node_name: str, address: str, abi: str, function_name: str, args: list | None = None, is_write: bool = False) -> dict:
    resp = requests.post(
        urljoin(_agent_url(organization), "api/contracts/call"),
        json={
            "node_name": node_name,
            "address": address,
            "abi": abi,
            "function_name": function_name,
            "args": args or [],
            "is_write": is_write,
        },
    )
    resp.raise_for_status()
    return resp.json()


def list_contracts(organization, node_name: str | None = None) -> list[dict]:
    params = {}
    if node_name:
        params["node_name"] = node_name
    resp = requests.get(
        urljoin(_agent_url(organization), "api/contracts"),
        params=params,
    )
    resp.raise_for_status()
    return resp.json()["data"]
