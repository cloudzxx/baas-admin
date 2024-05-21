from abc import ABC, abstractmethod
from typing import Any


class BlockChainDriver(ABC):
    @abstractmethod
    def create_node(self, name: str, node_type: str, organization: Any, **kwargs) -> dict:
        ...

    @abstractmethod
    def get_node_env(self, node_data: dict) -> dict:
        ...

    @abstractmethod
    def get_node_config_template(self, node_type: str) -> str:
        ...

    @abstractmethod
    def get_node_directory(self, organization_name: str, node_type: str, node_domain_name: str) -> str:
        ...

    @abstractmethod
    def get_node_cmd(self, node_type: str) -> str | None:
        ...
