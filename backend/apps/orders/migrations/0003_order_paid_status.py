from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0002_order_payment_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending_payment", "Pending payment"),
                    ("paid", "Paid"),
                    ("processing", "Processing"),
                    ("delivered", "Delivered"),
                    ("cancelled", "Cancelled"),
                ],
                default="paid",
                max_length=16,
            ),
        ),
    ]