from django.contrib.auth.models import User
from django.db import models


class TodoStatus(models.TextChoices):
    active = "active"
    done = "done"


class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=32, choices=TodoStatus.choices, default=TodoStatus.active)
    city = models.CharField(max_length=128, default=None, null=True)
    state = models.CharField(max_length=128, default=None, null=True)
    country = models.CharField(max_length=128, default=None, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']
