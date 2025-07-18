from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['priority', 'status']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskCreateSerializer
        return TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.all()
        search = self.request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        return queryset


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TaskUpdateSerializer
        return TaskSerializer


@api_view(['GET'])
def task_stats(request):
    """
    Endpoint para obtener estadísticas de las tareas
    """
    total_tasks = Task.objects.count()
    pending_tasks = Task.objects.filter(status='pending').count()
    in_progress_tasks = Task.objects.filter(status='in_progress').count()
    completed_tasks = Task.objects.filter(status='completed').count()
    
    high_priority = Task.objects.filter(priority='high').count()
    medium_priority = Task.objects.filter(priority='medium').count()
    low_priority = Task.objects.filter(priority='low').count()
    
    stats = {
        'total_tasks': total_tasks,
        'by_status': {
            'pending': pending_tasks,
            'in_progress': in_progress_tasks,
            'completed': completed_tasks
        },
        'by_priority': {
            'high': high_priority,
            'medium': medium_priority,
            'low': low_priority
        }
    }
    
    return Response(stats)


@api_view(['PATCH'])
def update_task_status(request, pk):
    """
    Endpoint específico para actualizar solo el estado de una tarea
    """
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Tarea no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status not in ['pending', 'in_progress', 'completed']:
        return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)
    
    task.status = new_status
    task.save()
    
    serializer = TaskSerializer(task)
    return Response(serializer.data)
