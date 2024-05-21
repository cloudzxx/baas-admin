from django.db import migrations, models
import django.db.models.deletion
import common.utils


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("node", "0002_node_blockchain_type_config"),
    ]

    operations = [
        migrations.CreateModel(
            name="FiscoGroup",
            fields=[
                ("id", models.UUIDField(default=common.utils.make_uuid, primary_key=True, serialize=False)),
                ("group_id", models.IntegerField(help_text="FISCO BCOS group ID")),
                ("chain_id", models.IntegerField(default=1, help_text="FISCO BCOS chain ID")),
                ("genesis_account", models.CharField(blank=True, default="", help_text="Genesis account address", max_length=256)),
                ("status", models.CharField(default="CREATED", max_length=32)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("node", models.ForeignKey(help_text="Associated Cello node", on_delete=django.db.models.deletion.CASCADE, related_name="fisco_groups", to="node.node")),
            ],
            options={
                "ordering": ("-created_at",),
            },
        ),
    ]
