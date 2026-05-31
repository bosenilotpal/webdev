from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views
from .auth import EmailTokenObtainPairView, MeView, RegisterView, TokenRefreshPublicView
from .cms_views import CmsItemViewSet

router = DefaultRouter()
router.register(r'gyms', views.GymViewSet, basename='gym')
router.register(r'classes', views.ClassViewSet, basename='gymclass')
router.register(r'plans', views.PlanViewSet, basename='plan')
router.register(r'trainers', views.TrainerViewSet, basename='trainer')
router.register(r'cms', CmsItemViewSet, basename='cms')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshPublicView.as_view(), name='auth-refresh'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('', include(router.urls)),
]
