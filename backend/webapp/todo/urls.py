from django.urls import path

from . import views

urlpatterns = [
    path('', views.TodosView.as_view(), name='todos'),
    path('<int:pk>', views.TodoDetails.as_view(), name='todo-details'),
]
