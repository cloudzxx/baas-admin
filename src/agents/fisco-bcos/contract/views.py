from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from contract.models import FiscoContract
from contract.serializers import (
    ContractDeploySerializer,
    ContractCallSerializer,
    ContractResponseSerializer,
    ContractListSerializer,
)
from contract.service import deploy_contract, call_contract, list_contracts


class ContractViewSet(viewsets.ViewSet):
    @extend_schema(
        responses={200: ContractListSerializer},
    )
    def list(self, request):
        node_name = request.query_params.get("node_name")
        contracts = list_contracts(node_name)
        return Response(
            ContractListSerializer({
                "total": len(contracts),
                "data": ContractResponseSerializer(contracts, many=True).data,
            }).data,
        )

    @extend_schema(
        request=ContractDeploySerializer,
        responses={201: ContractResponseSerializer},
    )
    def create(self, request):
        serializer = ContractDeploySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract = deploy_contract(
            node_name=serializer.validated_data["node_name"],
            name=serializer.validated_data["name"],
            bytecode=serializer.validated_data["bytecode"],
            abi=serializer.validated_data.get("abi", ""),
            constructor_args=serializer.validated_data.get("constructor_args", []),
        )
        return Response(
            ContractResponseSerializer(contract).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        request=ContractCallSerializer,
        responses={200: dict},
    )
    @action(detail=False, methods=["post"])
    def call(self, request):
        serializer = ContractCallSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = call_contract(
            node_name=serializer.validated_data["node_name"],
            address=serializer.validated_data["address"],
            abi=serializer.validated_data["abi"],
            function_name=serializer.validated_data["function_name"],
            args=serializer.validated_data.get("args", []),
            is_write=serializer.validated_data["is_write"],
        )
        return Response(result)

    def destroy(self, request, pk=None):
        try:
            contract = FiscoContract.objects.get(address=pk)
            contract.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FiscoContract.DoesNotExist:
            return Response(
                {"error": "Contract not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
