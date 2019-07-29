from django.urls import path
from elo import views

urlpatterns = [
    path('players/', views.player_list),
    path('players/<int:pk>/', views.player_detail)
]
