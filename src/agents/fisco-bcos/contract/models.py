from django.db import models


class FiscoContract(models.Model):
    address = models.CharField(
        max_length=256,
        help_text="Contract address on the chain",
        unique=True,
    )
    name = models.CharField(
        max_length=128,
        help_text="Contract name",
    )
    abi = models.TextField(
        help_text="Contract ABI (JSON)",
        blank=True,
        default="",
    )
    bytecode = models.TextField(
        help_text="Contract bytecode (hex)",
        blank=True,
        default="",
    )
    owner = models.CharField(
        max_length=256,
        help_text="Deployer account address",
        blank=True,
        default="",
    )
    node_name = models.CharField(
        max_length=128,
        help_text="FISCO node container name",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
