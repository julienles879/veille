from django.contrib import admin

from django.contrib import admin
from .models import User
from django.urls import reverse
from django.utils.html import format_html
from django.shortcuts import redirect



@admin.register(User)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    list_editable = ('is_active',)
    search_fields = ('username', 'email')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_superuser=False)
