#
# SPDX-License-Identifier: Apache-2.0
#
import enum
from typing import Type, Dict, Optional

from rest_framework import serializers
from rest_framework import status

from api.common.serializers import BadResponseSerializer


class Status(enum.Enum):
    SUCCESSFUL = "SUCCESSFUL"
    FAILED = "FAILED"


def make_response_serializer(data_serializer: Type[serializers.Serializer]):
    class _ResponseBody(serializers.Serializer):
        status = serializers.ChoiceField(
            choices=[(s.value, s.name) for s in Status]
        )
        msg = serializers.CharField(required=False, allow_null=True, allow_blank=True)
        data = data_serializer(required=False, allow_null=True)

    _ResponseBody.__name__ = f"ResponseBody[{data_serializer.__name__}]"
    return _ResponseBody


def ok(data: Dict[str, any]) -> Dict[str, any]:
    return {
        "status": Status.SUCCESSFUL.value,
        "msg": None,
        "data": data
    }


def err(msg: str) -> Dict[str, any]:
    return {
        "status": Status.FAILED.value,
        "msg": msg,
        "data": None
    }


def with_common_response(responses: Optional[Dict] = None) -> Dict:
    if responses is None:
        responses = {}

    responses.update({
        status.HTTP_400_BAD_REQUEST: BadResponseSerializer,
        status.HTTP_401_UNAUTHORIZED: "Permission denied",
        status.HTTP_500_INTERNAL_SERVER_ERROR: "Internal Error",
        status.HTTP_403_FORBIDDEN: "Authentication credentials were not provided.",
    })

    return responses
