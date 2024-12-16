from django.contrib import admin
from .models import TaskConfiguration

@admin.register(TaskConfiguration)
class TaskConfigurationAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'repeat_time')
    list_editable = ('repeat_time',)
    search_fields = ('task_name',)
