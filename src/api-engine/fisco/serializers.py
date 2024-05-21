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
