from django.urls import path

from . import views

urlpatterns = [
    path('/current/<str:location>', views.weather, name='weather'),
    path('/geo/<str:city>', views.geo, name='geo'),
]
