# Generated by Django 4.1.7 on 2023-11-20 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_todo_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='city',
            field=models.CharField(default=None, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='country',
            field=models.CharField(default=None, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name='todo',
            name='state',
            field=models.CharField(default=None, max_length=128, null=True),
        ),
    ]
