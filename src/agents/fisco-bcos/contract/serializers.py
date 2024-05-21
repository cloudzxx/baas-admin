from rest_framework import serializers

from contract.models import FiscoContract


class ContractDeploySerializer(serializers.Serializer):
    node_name = serializers.CharField(help_text="FISCO node container name")
    name = serializers.CharField(help_text="Contract name")
    abi = serializers.CharField(help_text="Contract ABI (JSON)", required=False, default="")
    bytecode = serializers.CharField(help_text="Contract bytecode (hex)")
    constructor_args = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        default=list,
    )


class ContractCallSerializer(serializers.Serializer):
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


class ContractResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiscoContract
        fields = ("address", "name", "abi", "owner", "node_name", "created_at")


class ContractListSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    data = ContractResponseSerializer(many=True)
