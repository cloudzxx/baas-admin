from rest_framework import serializers

from api.common.serializers import ListResponseSerializer


class FiscoGroupCreateSerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Group node name")
    role = serializers.ChoiceField(
        choices=["GROUP_NODE", "OBSERVER", "FREEZER"],
        default="GROUP_NODE",
    )
    group_id = serializers.IntegerField(default=1)
    chain_id = serializers.IntegerField(default=1)

    def validate(self, data):
        org = self.context["organization"]
        if any(n.name == data["name"] for n in org.nodes.all()):
            raise serializers.ValidationError("Node name already exists")
        return data


class FiscoGroupResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(source="node.name")
    type = serializers.CharField(source="node.type")
    blockchain_type = serializers.CharField(source="node.blockchain_type")
    group_id = serializers.IntegerField()
    chain_id = serializers.IntegerField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()


class FiscoGroupList(ListResponseSerializer):
    data = FiscoGroupResponseSerializer(many=True, help_text="FISCO BCOS group list")


class FiscoContractDeploySerializer(serializers.Serializer):
    node_name = serializers.CharField(help_text="FISCO node container name")
    name = serializers.CharField(help_text="Contract name")
    abi = serializers.CharField(help_text="Contract ABI (JSON)", required=False, default="")
    bytecode = serializers.CharField(help_text="Contract bytecode (hex)")
    constructor_args = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        default=list,
    )


class FiscoContractCallSerializer(serializers.Serializer):
    node_name = serializers.CharField(help_text="FISCO node container name")
    address = serializers.CharField(help_text="Contract address")
    abi = serializers.CharField(help_text="Contract ABI (JSON)")
    function_name = serializers.CharField(help_text="Function name to call")
    args = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        default=list,
    )
    is_write = serializers.BooleanField(default=False)


class FiscoContractResponseSerializer(serializers.Serializer):
    address = serializers.CharField()
    name = serializers.CharField()
    abi = serializers.CharField()
    owner = serializers.CharField()
    node_name = serializers.CharField()
    created_at = serializers.DateTimeField()


class FiscoContractList(serializers.Serializer):
    total = serializers.IntegerField()
    data = FiscoContractResponseSerializer(many=True)
