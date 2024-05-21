from django.db import models

from common.utils import make_uuid
from node.models import Node


class FiscoGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=make_uuid)
    group_id = models.IntegerField(help_text="FISCO BCOS group ID")
    chain_id = models.IntegerField(help_text="FISCO BCOS chain ID", default=1)
    genesis_account = models.CharField(
        help_text="Genesis account address",
        max_length=256,
        blank=True,
        default="",
    )
    node = models.ForeignKey(
        Node,
        help_text="Associated Cello node",
        related_name="fisco_groups",
        on_delete=models.CASCADE,
    )
    status = models.CharField(max_length=32, default="CREATED")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
