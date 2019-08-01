from django.urls import path
from elo import views

urlpatterns = [
    path('players/', views.PlayerList.as_view()),
    path('players/<int:pk>/', views.PlayerDetail.as_view()),
    path('teams/', views.TeamList.as_view()),
    path('teams/<int:pk>/', views.TeamDetail.as_view()),
    path('matchs/', views.MatchList.as_view()),
    path('matchs/<int:pk>/', views.MatchDetail.as_view()),
]
