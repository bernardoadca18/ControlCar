"""
URL configuration for control_plane project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from tenants.views import TenantViewSet, PlanViewSet, CheckDomainView
from accounts.views import UserProfileView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
# Router automático do DRF
router = DefaultRouter()
router.register(r'plans', PlanViewSet, basename='plans')
router.register(r'tenants', TenantViewSet, basename='tenants')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Rotas Principais
    path('api/v1/', include(router.urls)),
    path('api/v1/check-domain/', CheckDomainView.as_view(), name='check_domain'),
    path('api/v1/auth/me/', UserProfileView.as_view(), name='user_profile'),

    # Autenticação (JWT)
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Documentação (Swagger / Redoc)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]