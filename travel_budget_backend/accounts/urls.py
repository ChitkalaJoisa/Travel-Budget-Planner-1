from django.urls import path
from .views import register_user, login_user, delete_account, get_profile, change_password

urlpatterns = [
    path("register/", register_user),
    path("login/", login_user),
    path("delete/", delete_account),
    path("profile/", get_profile),
    path("change-password/", change_password), 
]