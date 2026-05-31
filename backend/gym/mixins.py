from .models import Gym


class OwnerGymQuerysetMixin:
    """
    Public list may filter by ?gym_id=.
    Authenticated gym owners only see (and manage) their own gym's records.
    """

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_authenticated and not (user.is_staff or user.is_superuser):
            gym = Gym.objects.filter(owner_user_id=user).first()
            if gym:
                return queryset.filter(gym_id=gym)
            return queryset.none()

        gym_id = self.request.query_params.get('gym_id')
        if gym_id:
            return queryset.filter(gym_id=gym_id)
        # Unauthenticated callers must pass gym_id (e.g. public gym page)
        return queryset.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            gym_id = self.request.data.get('gym_id')
            if gym_id:
                serializer.save(gym_id_id=gym_id)
                return
        gym = Gym.objects.filter(owner_user_id=user).first()
        if not gym:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                {
                    'detail': 'You must own a gym before adding classes, trainers, or plans.'
                }
            )
        serializer.save(gym_id=gym)
