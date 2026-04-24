import re
from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # ✅ EMAIL VALIDATION
    def validate_email(self, value):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Invalid email format")

        fake_domains = ["tempmail.com", "mailinator.com", "10minutemail.com"]
        domain = value.split("@")[1]

        if domain in fake_domains:
            raise serializers.ValidationError("Temporary emails are not allowed")

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Email already registered")

        return value

    # ✅ PASSWORD VALIDATION
    def validate(self, data):
        password = data.get('password')

        if password != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")

        if len(password) < 6:
            raise serializers.ValidationError(
                "Password must be at least 6 characters"
            )

        pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).+$'
        if not re.match(pattern, password):
            raise serializers.ValidationError(
                "Password must contain letters, numbers, and a special character"
            )

        return data

    # ✅ CREATE USER
    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['email'],   # 🔥 IMPORTANT
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            password=validated_data['password']
        )

        return user