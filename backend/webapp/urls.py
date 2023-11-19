"""
URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/todo/', include('webapp.todo.urls')),
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/logout/', views.logout_view, name='logout'),
    path('api/auth/whoami/', views.whoami, name='whoami'),
    path('api/auth/csrf/', views.csrf, name='csrf'),
]
