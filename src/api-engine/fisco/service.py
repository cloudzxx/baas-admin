import logging

import requests
from urllib.parse import urljoin

from node.drivers import get_driver
from node.models import Node
from fisco.models import FiscoGroup

LOG = logging.getLogger(__name__)


def create_fisco_node(organization, name: str, role: str, group_id: int = 1, chain_id: int = 1) -> FiscoGroup:
    driver = get_driver("fisco")
    result = driver.create_node(name, role, organization, group_id=group_id, chain_id=chain_id)
    node = Node(
        name=name,
        type=role,
        blockchain_type="fisco",
        tls="",
        config={"group_id": group_id, "chain_id": chain_id},
        organization=organization,
    )
    node.save()
    group = FiscoGroup(
        group_id=group_id,
        chain_id=chain_id,
        node=node,
    )
    group.save()
    return group


def get_fisco_node_status(organization, node: Node) -> str:
    agent_url = organization.agent_url
    response = requests.get(
        urljoin(agent_url, "api/nodes/status"),
        params=dict(name=node.name),
    )
    response.raise_for_status()
    return response.json()["status"]


def delete_fisco_node(organization, node: Node) -> None:
    agent_url = organization.agent_url
    requests.delete(urljoin(agent_url, f"api/nodes/{node.name}"))
    node.delete()
