from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import RSSFeedEntry, Favorite

class FavoriteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.login(username='testuser', password='password')
        self.article = RSSFeedEntry.objects.create(
            feed_id=1,
            title="Test Article",
            link="http://example.com/test-article",
            content="Test content",
            published_at="2024-12-16T12:00:00Z"
        )

    def test_add_favorite(self):
        response = self.client.post('/articles/favorites/', {'article': self.article.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_favorites(self):
        Favorite.objects.create(user=self.user, article=self.article)
        response = self.client.get('/articles/favorites/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_favorite(self):
        favorite = Favorite.objects.create(user=self.user, article=self.article)
        response = self.client.delete(f'/articles/favorites/{favorite.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
