from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from users import urls as users_urls
from feeds import urls as feeds_urls
from articles import urls as articles_urls
from veille import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('utilisateur/', include(users_urls)),
    path('feeds/', include(feeds_urls)),
    path('articles/', include(articles_urls))

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)