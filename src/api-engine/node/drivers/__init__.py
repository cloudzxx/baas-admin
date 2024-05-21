from typing import Type

from node.drivers.base import BlockChainDriver

_registry: dict[str, Type[BlockChainDriver]] = {}
_instances: dict[str, BlockChainDriver] = {}


def register_driver(driver_cls: Type[BlockChainDriver], name: str | None = None) -> None:
    name = name or driver_cls.label
    _registry[name] = driver_cls


def get_driver(name: str) -> BlockChainDriver:
    if name not in _registry:
        raise KeyError(f"Driver '{name}' not registered")
    if name not in _instances:
        _instances[name] = _registry[name]()
    return _instances[name]


def list_drivers() -> list[str]:
    return list(_registry.keys())


try:
    from node.drivers import fabric  # noqa: F401
except ImportError:
    # fabric driver or its dependencies not available
    pass

try:
    from node.drivers import fisco  # noqa: F401
except ImportError:
    # fisco driver or its dependencies not available
    pass
