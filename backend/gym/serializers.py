from rest_framework import serializers

from .models import Class, CmsItem, Gym, Plans, Trainer


def _absolute_image_url(request, fieldfile):
    if not fieldfile:
        return None
    try:
        url = fieldfile.url
    except ValueError:
        return None
    if request:
        return request.build_absolute_uri(url)
    return url


class GymSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Gym
        fields = [
            'id',
            'owner_user_id',
            'name',
            'location',
            'featured',
            'image_url',
            'description',
            'address',
            'phone_number',
            'email',
            'created_at',
            'updated_at',
        ]

    def get_image_url(self, obj):
        return _absolute_image_url(self.context.get('request'), obj.image_url)


class ClassSerializer(serializers.ModelSerializer):
    gym_id = serializers.PrimaryKeyRelatedField(
        queryset=Gym.objects.all(), required=False
    )
    description = serializers.CharField(required=False, allow_blank=True, default='')
    image_url = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Class
        fields = [
            'id',
            'gym_id',
            'name',
            'duration',
            'number_of_classes',
            'price',
            'description',
            'image_url',
            'sort_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'sort_order', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_url'] = _absolute_image_url(
            self.context.get('request'), instance.image_url
        )
        return data


class PlanSerializer(serializers.ModelSerializer):
    gym_id = serializers.PrimaryKeyRelatedField(
        queryset=Gym.objects.all(), required=False
    )
    description = serializers.CharField(required=False, allow_blank=True, default='')
    features = serializers.CharField(required=False, allow_blank=True, default='')
    classes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Class.objects.all(),
        required=False,
    )

    class Meta:
        model = Plans
        fields = [
            'id',
            'gym_id',
            'name',
            'duration',
            'price',
            'description',
            'features',
            'sort_order',
            'created_at',
            'updated_at',
            'classes',
        ]
        read_only_fields = ['id', 'sort_order', 'created_at', 'updated_at']


class CmsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CmsItem
        fields = [
            'id',
            'gym_id',
            'name',
            'content',
            'type',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'gym_id', 'name', 'type', 'created_at', 'updated_at']


class TrainerSerializer(serializers.ModelSerializer):
    gym_id = serializers.PrimaryKeyRelatedField(
        queryset=Gym.objects.all(), required=False
    )
    bio = serializers.CharField(required=False, allow_blank=True, default='')
    image_url = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Trainer
        fields = [
            'id',
            'gym_id',
            'name',
            'experience',
            'image_url',
            'bio',
            'sort_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'sort_order', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image_url'] = _absolute_image_url(
            self.context.get('request'), instance.image_url
        )
        return data
