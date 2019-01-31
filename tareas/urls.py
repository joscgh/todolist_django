from django.urls import path, include
from tareas import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create_tarea/', views.create_tarea, name='crear-tarea'),
    path('list_tareas/', views.list_tareas, name='list-tareas'),
]