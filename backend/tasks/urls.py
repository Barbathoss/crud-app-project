from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    # CRUD endpoints
    path('', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    
    # Utility endpoints
    path('stats/', views.task_stats, name='task-stats'),
    path('<int:pk>/status/', views.update_task_status, name='update-task-status'),
]