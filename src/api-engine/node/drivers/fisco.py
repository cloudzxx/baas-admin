import logging

import requests
from urllib.parse import urljoin

from node.drivers import register_driver
from node.drivers.base import BlockChainDriver

LOG = logging.getLogger(__name__)


class FiscoDriver(BlockChainDriver):
    label = "fisco"

    def create_node(self, name: str, node_type: str, organization, **kwargs) -> dict:
        agent_url = organization.agent_url
        requests.get(urljoin(agent_url, "health")).raise_for_status()
        response = requests.post(
            urljoin(agent_url, "api/nodes"),
            json=dict(
                name=name,
                role=node_type,
                group_id=kwargs.get("group_id", 1),
                chain_id=kwargs.get("chain_id", 1),
            ),
        )
        response.raise_for_status()
        return response.json()

    def get_node_env(self, node_data: dict) -> dict:
        return {
            "FISCO_GROUP_ID": str(node_data.get("group_id", 1)),
            "FISCO_CHAIN_ID": str(node_data.get("chain_id", 1)),
            "FISCO_NODE_ROLE": node_data.get("role", "GROUP_NODE"),
        }

    def get_node_config_template(self, node_type: str) -> str:
        return ""

    def get_node_directory(self, organization_name: str, node_type: str, node_domain_name: str) -> str:
        from api_engine.settings import FXBAAS_HOME
        return f"{FXBAAS_HOME}/{organization_name}/fisco/{node_type}s/{node_domain_name}"

    def get_node_cmd(self, node_type: str) -> str | None:
        return "fisco-bcos"

register_driver(FiscoDriver)
