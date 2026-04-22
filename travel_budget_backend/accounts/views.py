from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import random
from django.core.mail import send_mail
from django.conf import settings

# Generate JWT Token
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register API
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens(user)
        return Response({
            "message": "User registered successfully",
            "tokens": tokens
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login API
@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user:
        tokens = get_tokens(user)
        return Response({
            "message": "Login successful",
            "tokens": tokens
        })

    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        "name": user.first_name,
        "email": user.email,
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({"message": "Account deleted successfully"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    # Check old password
    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=400)

    # Validate new password
    if len(new_password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully"})

@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    # Validate email format
    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "Invalid email format"}, status=400)

    from django.contrib.auth.models import User
    user = User.objects.filter(email=email).first()

    if user and user.check_password(password):
        tokens = get_tokens(user)
        return Response({
            "message": "Login successful",
            "tokens": tokens
        })

    return Response({"error": "Invalid credentials"}, status=400)

otp_store = {}

@api_view(['POST'])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email required"}, status=400)

    otp = random.randint(100000, 999999)
    otp_store[email] = otp

    try:
        send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            settings.EMAIL_HOST_USER,   # ✅ IMPORTANT
            [email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent successfully"})

    except Exception as e:
        print("EMAIL ERROR:", str(e))  # 👈 VERY IMPORTANT
        return Response({"error": "Failed to send OTP"}, status=500)

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp = int(request.data.get("otp"))

    if otp_store.get(email) != otp:
        return Response({"error": "Invalid OTP"}, status=400)

    return Response({"message": "OTP verified"})