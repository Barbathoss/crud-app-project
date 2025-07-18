from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'priority_display',
            'status',
            'status_display',
            'created_at',
            'updated_at',
            'due_date',
            'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
        return value.strip()


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'due_date']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
        return value.strip()


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'priority', 'status', 'due_date']

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El título debe tener al menos 3 caracteres.")
        return value.strip()