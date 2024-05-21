import logging

import docker

from fisco_bcos.settings import FISCO_VERSION

LOG = logging.getLogger(__name__)
docker_client = docker.DockerClient("unix:///var/run/docker.sock")


def create_node(name: str, role: str, group_id: int, chain_id: int) -> dict:
    p2p_port = 30300
    channel_port = 20200
    jsonrpc_port = 8545

    env = {
        "FISCO_GROUP_ID": str(group_id),
        "FISCO_CHAIN_ID": str(chain_id),
        "FISCO_NODE_ROLE": role,
        "FISCO_P2P_PORT": str(p2p_port),
        "FISCO_CHANNEL_PORT": str(channel_port),
        "FISCO_JSONRPC_PORT": str(jsonrpc_port),
    }

    try:
        container = docker_client.containers.run(
            f"fiscoorg/fisco-bcos:{FISCO_VERSION}",
            detach=True,
            tty=True,
            stdin_open=True,
            name=name,
            network="baas-admin-net",
            ports={
                f"{p2p_port}/tcp": p2p_port,
                f"{channel_port}/tcp": channel_port,
                f"{jsonrpc_port}/tcp": jsonrpc_port,
            },
            environment=env,
        )
        return {
            "container_id": container.id,
            "name": name,
            "role": role,
            "group_id": group_id,
            "chain_id": chain_id,
            "p2p_port": p2p_port,
            "channel_port": channel_port,
            "jsonrpc_port": jsonrpc_port,
        }
    except docker.errors.APIError as e:
        LOG.error("Docker API error creating FISCO node: %s", e)
        raise


def get_node_status(name: str) -> str:
    try:
        container = docker_client.containers.get(name)
        return container.status
    except docker.errors.NotFound:
        return "NOT_FOUND"


def delete_node(name: str) -> None:
    try:
        container = docker_client.containers.get(name)
        container.remove(force=True)
    except docker.errors.NotFound:
        pass
