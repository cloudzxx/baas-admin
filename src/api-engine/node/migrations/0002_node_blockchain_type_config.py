# Generated manually - adds blockchain_type and config fields to Node model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("node", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="node",
            name="blockchain_type",
            field=models.CharField(
                default="fabric",
                help_text="Blockchain Platform Type",
                max_length=32,
            ),
        ),
        migrations.AddField(
            model_name="node",
            name="config",
            field=models.JSONField(
                blank=True, default=dict, help_text="Platform-specific configuration"
            ),
        ),
    ]
