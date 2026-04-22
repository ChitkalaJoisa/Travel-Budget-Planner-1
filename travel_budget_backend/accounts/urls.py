from django.urls import path
from .views import register_user, login_user, delete_account, get_profile, change_password
from .views import send_otp, verify_otp

urlpatterns = [
    path("register/", register_user),
    path("login/", login_user),
    path("delete/", delete_account),
    path("profile/", get_profile),
    path("change-password/", change_password),
    path("send-otp/", send_otp),
    path("verify-otp/", verify_otp), 
]