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

    def validate(self, data):
        password = data.get('password')

        # 🔹 Check password match
        if password != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")

        # 🔹 Length check
        if len(password) < 6:
            raise serializers.ValidationError(
                "Password must be atleast 6 Characters."
            )

        # 🔹 Complexity check
        pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).+$'
        if not re.match(pattern, password):
            raise serializers.ValidationError(
                "Password must be combinations of letters, numbers and a special character."
            )

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            password=validated_data['password']
        )
        return user

    class RegisterSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['first_name', 'email', 'password']

    def validate_email(self, value):
        # Format validation
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Invalid email format")

        # Block fake domains
        fake_domains = ["tempmail.com", "mailinator.com", "10minutemail.com"]
        domain = value.split("@")[1]

        if domain in fake_domains:
            raise serializers.ValidationError("Temporary emails are not allowed")

        return value