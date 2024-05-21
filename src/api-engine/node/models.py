from django.db import models

from common.utils import make_uuid
from organization.models import Organization


# Create your models here.

class Node(models.Model):
    class Type(models.TextChoices):
        PEER = "PEER", "Peer"
        ORDERER = "ORDERER", "Orderer"

    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        RUNNING = "RUNNING", "Running"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(
        primary_key=True,
        help_text="Node ID",
        default=make_uuid,
    )
    name = models.CharField(
        help_text="Node Name",
        max_length=64,
    )
    type = models.CharField(
        help_text="Node Type",
        choices=Type.choices,
        max_length=64,
    )
    tls = models.TextField(
        help_text="Node TLS",
    )
    blockchain_type = models.CharField(
        help_text="Blockchain Platform Type",
        max_length=32,
        default="fabric",
    )
    config = models.JSONField(
        help_text="Platform-specific configuration",
        default=dict,
        blank=True,
    )
    organization = models.ForeignKey(
        Organization,
        help_text="Organization Nodes",
        related_name="nodes",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(
        help_text="Node Creation Timestamp", auto_now_add=True
    )

    @property
    def driver(self):
        from node.drivers import get_driver
        return get_driver(self.blockchain_type)

    class Meta:
        ordering = ("-created_at",)
