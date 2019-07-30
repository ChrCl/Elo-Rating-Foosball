from django.urls import path
from elo import views

urlpatterns = [
    path('players/', views.PlayerList.as_view()),
    path('players/<int:pk>/', views.PlayerDetail.as_view())
]
