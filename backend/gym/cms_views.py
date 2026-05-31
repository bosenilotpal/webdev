from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .cms_defaults import ensure_gym_cms_defaults
from .mixins import OwnerGymQuerysetMixin
from .models import CmsItem, Gym
from .permissions import IsAuthenticatedForWrite, IsGymOwnerOrReadOnly
from .serializers import CmsItemSerializer


class CmsItemViewSet(
    OwnerGymQuerysetMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """List and update per-gym CMS content. Defaults are auto-seeded on first access."""

    serializer_class = CmsItemSerializer
    queryset = CmsItem.objects.select_related('gym_id').all()
    permission_classes = [IsAuthenticatedForWrite, IsGymOwnerOrReadOnly]
    http_method_names = ['get', 'head', 'options', 'patch', 'put']

    def _ensure_defaults(self):
        gym_id = self.request.query_params.get('gym_id')
        if gym_id:
            gym = Gym.objects.filter(pk=gym_id).first()
            if gym:
                ensure_gym_cms_defaults(gym)
            return
        if self.request.user.is_authenticated:
            gym = Gym.objects.filter(owner_user_id=self.request.user).first()
            if gym:
                ensure_gym_cms_defaults(gym)

    def list(self, request, *args, **kwargs):
        self._ensure_defaults()
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self._ensure_defaults()
        return super().retrieve(request, *args, **kwargs)
