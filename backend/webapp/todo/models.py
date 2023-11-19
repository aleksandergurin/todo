from django.db import models


class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    # TODO: add user link

    class Meta:
        ordering = ['id']
