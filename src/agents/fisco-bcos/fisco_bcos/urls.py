from django.urls import path, include
from rest_framework.routers import DefaultRouter
from node.views import FiscoNodeViewSet
from contract.views import ContractViewSet
from fisco_bcos.views import health

router = DefaultRouter(trailing_slash=False)
router.register("nodes", FiscoNodeViewSet, basename="node")
router.register("contracts", ContractViewSet, basename="contract")

urlpatterns = [
    path("api/", include(router.urls)),
    path("health", health),
]
