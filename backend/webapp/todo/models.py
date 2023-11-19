from django.contrib.auth.models import User
from django.db import models


class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']
