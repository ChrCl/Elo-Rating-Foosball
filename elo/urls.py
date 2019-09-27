from django.urls import path
from elo import views

urlpatterns = [
    path('players/', views.PlayerList.as_view()),
    path('player/<int:pk>/', views.PlayerDetail.as_view()),
    path('teams/', views.TeamList.as_view()),
    path('team/<int:pk>/', views.TeamDetail.as_view()),
    path('matches/', views.MatchList.as_view()),
    path('match/<int:pk>/', views.MatchDetail.as_view()),
    path('player/<int:player>/history/', views.PlayerhistoryDetail.as_view()),
]
