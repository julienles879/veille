from django.db.models.functions import TruncDay
from django.db.models import Count
from django.http import JsonResponse

from .models import RSSFeedEntry
from feeds.models import Category

def stats_articles(request):
    # Articles ajoutés par jour
    articles_par_jour = (
        RSSFeedEntry.objects
        .filter(published_at__isnull=False)
        .annotate(day=TruncDay("published_at"))
        .values("day")
        .annotate(total=Count("id"))
        .order_by("day")
    )

    # Articles par catégorie (via le flux RSS)
    articles_par_categorie = (
        Category.objects
        .annotate(total=Count("feeds__entries"))
        .values("name", "total")
        .order_by("-total")
    )

    # Articles par flux RSS
    articles_par_flux = (
        RSSFeedEntry.objects
        .values("feed__title")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    return JsonResponse({
        "articles_par_jour": list(articles_par_jour),
        "articles_par_categorie": list(articles_par_categorie),
        "articles_par_flux": list(articles_par_flux),
    })
