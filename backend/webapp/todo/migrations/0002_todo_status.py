# Generated by Django 4.1.7 on 2023-11-19 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='status',
            field=models.CharField(choices=[('active', 'Active'), ('done', 'Done')], default='active', max_length=32),
        ),
    ]