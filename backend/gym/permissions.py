from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAuthenticatedForWrite(BasePermission):
    """Public read; authenticated users required for create/update/delete."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)


class IsGymOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj.gym_id.owner_user_id_id == request.user.pk
