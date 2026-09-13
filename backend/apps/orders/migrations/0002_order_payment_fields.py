from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending_payment", "Pending payment"),
                    ("processing", "Processing"),
                    ("delivered", "Delivered"),
                    ("cancelled", "Cancelled"),
                ],
                default="processing",
                max_length=16,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_reference",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]