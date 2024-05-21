from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from node.serializers import (
    FiscoNodeCreateSerializer,
    FiscoNodeResponseSerializer,
    FiscoNodeStatusSerializer,
)
from node.service import get_node_status, delete_node


class FiscoNodeViewSet(viewsets.ViewSet):
    @extend_schema(
        request=FiscoNodeCreateSerializer,
        responses={201: FiscoNodeResponseSerializer},
    )
    def create(self, request):
        serializer = FiscoNodeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            data=serializer.save(),
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        parameters=[FiscoNodeStatusSerializer],
        responses={200: FiscoNodeStatusSerializer},
    )
    @action(detail=False, methods=["get"])
    def status(self, request):
        name = request.query_params.get("name")
        if not name:
            return Response(
                {"error": "name parameter required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        s = get_node_status(name)
        return Response(FiscoNodeStatusSerializer({"name": name, "status": s}).data)

    def destroy(self, request, pk=None):
        delete_node(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
