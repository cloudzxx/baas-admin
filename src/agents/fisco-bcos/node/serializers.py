from rest_framework import serializers

from node.enums import FiscoNodeRole
from node.service import create_node, get_node_status, delete_node


class FiscoNodeCreateSerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Node name")
    role = serializers.ChoiceField(
        choices=[(r.value, r.value) for r in FiscoNodeRole],
        default=FiscoNodeRole.GROUP_NODE.value,
    )
    group_id = serializers.IntegerField(default=1)
    chain_id = serializers.IntegerField(default=1)

    def create(self, validated_data):
        result = create_node(
            validated_data["name"],
            validated_data["role"],
            validated_data["group_id"],
            validated_data["chain_id"],
        )
        return FiscoNodeResponseSerializer(result).data


class FiscoNodeResponseSerializer(serializers.Serializer):
    container_id = serializers.CharField()
    name = serializers.CharField()
    role = serializers.CharField()
    group_id = serializers.IntegerField()
    chain_id = serializers.IntegerField()
    p2p_port = serializers.IntegerField()
    channel_port = serializers.IntegerField()
    jsonrpc_port = serializers.IntegerField()


class FiscoNodeStatusSerializer(serializers.Serializer):
    name = serializers.CharField()
    status = serializers.CharField()
