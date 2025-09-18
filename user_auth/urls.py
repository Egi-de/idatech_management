app_name = 'auth'

from django.urls import path
from . import views
from django.urls import include

urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('settings/', views.profile_settings, name='settings'),
    path('trash-bin/', views.trash_bin, name='trash_bin'),
    path('restore-trash-entry/<int:entry_id>/', views.restore_trash_entry, name='restore_trash_entry'),
    path('google-login/', include('social_django.urls', namespace='social')),
]
