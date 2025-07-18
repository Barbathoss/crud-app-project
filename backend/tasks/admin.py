from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'status', 'created_at', 'due_date', 'completed_at')
    list_filter = ('priority', 'status', 'created_at', 'due_date')
    search_fields = ('title', 'description')
    list_editable = ('priority', 'status')
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Información básica', {
            'fields': ('title', 'description')
        }),
        ('Estado y prioridad', {
            'fields': ('status', 'priority', 'due_date')
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        })
    )
