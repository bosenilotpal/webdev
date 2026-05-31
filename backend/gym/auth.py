from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .cms_defaults import ensure_gym_cms_defaults
from .models import Gym

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Accept email + password instead of username."""

    username_field = 'email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields['password'] = serializers.CharField(write_only=True)
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'detail': 'Invalid email or password.'}
            ) from None

        if not user.check_password(password):
            raise serializers.ValidationError(
                {'detail': 'Invalid email or password.'}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {'detail': 'This account is disabled.'}
            )

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        gym = Gym.objects.filter(owner_user_id=user).first()

        if user.is_superuser or user.is_staff:
            role = 'admin'
        else:
            role = 'gym_owner'

        name = user.get_full_name().strip() or user.first_name or user.username

        return Response(
            {
                'id': user.pk,
                'email': user.email,
                'name': name,
                'role': role,
                'gym_id': gym.pk if gym else None,
            }
        )


class TokenRefreshPublicView(TokenRefreshView):
    """Refresh access token using a valid refresh token."""

    permission_classes = []


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    gym_name = serializers.CharField(max_length=255)
    gym_location = serializers.CharField(max_length=255)
    gym_phone = serializers.CharField(max_length=255, required=False, allow_blank=True)
    gym_email = serializers.EmailField(required=False, allow_blank=True)
    gym_description = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return email

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data['email']
        username_base = email.split('@')[0][:30] or 'user'
        username = username_base
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f'{username_base}{suffix}'
            suffix += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['name'],
        )

        gym_email = validated_data.get('gym_email') or email
        gym = Gym.objects.create(
            owner_user_id=user,
            name=validated_data['gym_name'],
            location=validated_data['gym_location'],
            phone_number=validated_data.get('gym_phone', ''),
            email=gym_email,
            description=validated_data.get('gym_description', ''),
            address=validated_data['gym_location'],
        )
        ensure_gym_cms_defaults(gym)
        return user


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        gym = Gym.objects.filter(owner_user_id=user).first()

        refresh = RefreshToken.for_user(user)
        name = user.get_full_name().strip() or user.first_name or user.username

        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.pk,
                    'email': user.email,
                    'name': name,
                    'role': 'gym_owner',
                    'gym_id': gym.pk if gym else None,
                },
            },
            status=status.HTTP_201_CREATED,
        )
