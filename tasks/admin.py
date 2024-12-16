from django.contrib import admin
from .models import TaskConfiguration
from django.urls import reverse
from django.utils.html import format_html
from django.shortcuts import redirect
from articles.tasks import fetch_articles_for_feeds

@admin.register(TaskConfiguration)
class TaskConfigurationAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'repeat_time', 'trigger_update')
    list_editable = ('repeat_time',)
    search_fields = ('task_name',)

    def trigger_update(self, obj):
        url = reverse('manual-rss-update')  # Utilise le nom de route défini dans `tasks/urls.py`
        return format_html('<a class="button" href="{}">Mettre à jour</a>', url)

    trigger_update.short_description = "Mise à jour"
    trigger_update.allow_tags = True
