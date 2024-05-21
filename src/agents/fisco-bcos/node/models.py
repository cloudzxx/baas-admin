from django.db import models


class FiscoNode(models.Model):
    name = models.CharField(max_length=100)
    node_id = models.CharField(max_length=128, default="")
    role = models.CharField(max_length=32, default="GROUP_NODE")
    group_id = models.IntegerField(default=1)
    chain_id = models.IntegerField(default=1)
    p2p_port = models.IntegerField(default=30300)
    channel_port = models.IntegerField(default=20200)
    jsonrpc_port = models.IntegerField(default=8545)
    status = models.CharField(max_length=32, default="CREATED")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
