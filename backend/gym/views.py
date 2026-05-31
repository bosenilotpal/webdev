from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .mixins import OwnerGymQuerysetMixin
from .models import Class, Gym, Plans, Trainer
from .permissions import IsAuthenticatedForWrite, IsGymOwnerOrReadOnly
from .serializers import (
    ClassSerializer,
    GymSerializer,
    PlanSerializer,
    TrainerSerializer,
)


class GymViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GymSerializer
    queryset = Gym.objects.select_related('owner_user_id').all()


class ClassViewSet(OwnerGymQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = ClassSerializer
    queryset = Class.objects.select_related('gym_id').all()
    permission_classes = [IsAuthenticatedForWrite, IsGymOwnerOrReadOnly]


class PlanViewSet(OwnerGymQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = PlanSerializer
    queryset = Plans.objects.select_related('gym_id').prefetch_related('classes').all()
    permission_classes = [IsAuthenticatedForWrite, IsGymOwnerOrReadOnly]


class TrainerViewSet(OwnerGymQuerysetMixin, viewsets.ModelViewSet):
    serializer_class = TrainerSerializer
    queryset = Trainer.objects.select_related('gym_id').all()
    permission_classes = [IsAuthenticatedForWrite, IsGymOwnerOrReadOnly]
    parser_classes = [JSONParser, FormParser, MultiPartParser]
