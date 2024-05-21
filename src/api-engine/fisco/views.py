from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.common import ok, with_common_response
from api.common.response import make_response_serializer
from common.serializers import PageQuerySerializer
from fisco.models import FiscoGroup
from fisco.serializers import FiscoGroupCreateSerializer, FiscoGroupList, FiscoGroupResponseSerializer
from fisco.service import create_fisco_node


class FiscoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List all FISCO BCOS nodes",
        query_serializer=PageQuerySerializer(),
        responses=with_common_response(
            {status.HTTP_200_OK: make_response_serializer(FiscoGroupList)}
        ),
    )
    def list(self, request):
        groups = FiscoGroup.objects.filter(
            node__organization=request.user.organization,
        )
        serializer = PageQuerySerializer(data=request.GET)
        p = serializer.get_paginator(groups)
        return Response(
            status=status.HTTP_200_OK,
            data=ok(FiscoGroupList(
                {
                    "total": p.count,
                    "data": FiscoGroupResponseSerializer(
                        p.page(serializer.data["page"]).object_list,
                        many=True,
                    ).data,
                },
            ).data),
        )

    @swagger_auto_schema(
        operation_summary="Create a FISCO BCOS group node",
        request_body=FiscoGroupCreateSerializer,
        responses=with_common_response(
            {status.HTTP_201_CREATED: make_response_serializer(FiscoGroupResponseSerializer)}
        ),
    )
    def create(self, request):
        serializer = FiscoGroupCreateSerializer(
            data=request.data,
            context={"organization": request.user.organization},
        )
        serializer.is_valid(raise_exception=True)
        group = create_fisco_node(
            request.user.organization,
            serializer.validated_data["name"],
            serializer.validated_data["role"],
            serializer.validated_data["group_id"],
            serializer.validated_data["chain_id"],
        )
        return Response(
            status=status.HTTP_201_CREATED,
            data=ok(FiscoGroupResponseSerializer(group).data),
        )
