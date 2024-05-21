from django.urls import path, include
from rest_framework.routers import DefaultRouter
from node.views import FiscoNodeViewSet

router = DefaultRouter(trailing_slash=False)
router.register("nodes", FiscoNodeViewSet, basename="node")

urlpatterns = [
    path("api/", include(router.urls)),
]
