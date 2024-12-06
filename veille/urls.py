from django.contrib import admin
from django.urls import path, include
from users import urls as users_urls
from feeds import urls as feeds_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('utilisateur/', include(users_urls)),
    path('feeds/', include(feeds_urls))
]