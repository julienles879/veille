from django.contrib import admin
from .models import RSSFeedEntry

@admin.register(RSSFeedEntry)
class RSSFeedEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'feed', 'published_at', 'link')
    search_fields = ('title', 'feed__title', 'link')
    list_filter = ('feed', 'published_at')
