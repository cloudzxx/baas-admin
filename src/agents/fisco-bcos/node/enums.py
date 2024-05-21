from enum import Enum


class FiscoNodeRole(str, Enum):
    GROUP_NODE = "GROUP_NODE"
    OBSERVER = "OBSERVER"
    FREEZER = "FREEZER"
