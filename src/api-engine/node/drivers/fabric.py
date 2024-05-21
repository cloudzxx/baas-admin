import requests
from urllib.parse import urljoin

from node.drivers import register_driver
from node.drivers.base import BlockChainDriver
from node.models import Node
import node.service as node_service
from api_engine.settings import FABRIC_PEER_CFG, FABRIC_ORDERER_CFG


class FabricDriver(BlockChainDriver):
    label = "fabric"

    def create_node(self, name: str, node_type: str, organization, **kwargs) -> dict:
        agent_url = organization.agent_url
        requests.get(urljoin(agent_url, "health")).raise_for_status()
        response = requests.post(
            urljoin(agent_url, "nodes"),
            json=dict(type=node_type, name=name),
        )
        response.raise_for_status()
        return response.json()

    def get_node_env(self, node_data: dict) -> dict:
        return node_service.get_node_env(
            Node.Type(node_data["node_type"]),
            node_data["node_domain_name"],
            node_data["msp"],
            node_data["tls"],
            node_data["cfg"],
        )

    def get_node_config_template(self, node_type: str) -> str:
        node_type_enum = Node.Type(node_type)
        if node_type_enum == Node.Type.PEER:
            return FABRIC_PEER_CFG
        elif node_type_enum == Node.Type.ORDERER:
            return FABRIC_ORDERER_CFG
        raise ValueError(f"Unknown node type: {node_type}")

    def get_node_directory(self, organization_name: str, node_type: str, node_domain_name: str) -> str:
        return node_service.get_node_directory(organization_name, Node.Type(node_type), node_domain_name)

    def get_node_cmd(self, node_type: str) -> str | None:
        return node_service.get_node_cmd(Node.Type(node_type))


register_driver(FabricDriver)
