from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Tenant, Plan
from accounts.models import User
from .serializers import TenantSerializer, PlanSerializer, TenantRegistrationSerializer

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lista os planos disponíveis publicamente para o site institucional.
    """
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]

class TenantViewSet(viewsets.ModelViewSet):
    """
    Gerencia os Tenants. 
    - Admin vê todos.
    - Owner vê apenas o seu.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff: # Admin do SaaS
            return Tenant.objects.all()
        return Tenant.objects.filter(owner=user)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """
        Endpoint público para registrar uma nova oficina (Sign Up).
        """
        serializer = TenantRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            try:
                with transaction.atomic():
                    # 1. Criar Usuário (Owner)
                    user = User.objects.create_user(
                        username=data['email'],
                        email=data['email'],
                        password=data['password'],
                        first_name=data['owner_name'].split()[0],
                        last_name=" ".join(data['owner_name'].split()[1:]) if " " in data['owner_name'] else ""
                    )

                    # 2. Buscar Plano
                    plan = Plan.objects.get(id=data['plan_id'])

                    # 3. Criar Tenant
                    tenant = Tenant.objects.create(
                        name=data['office_name'],
                        subdomain=data['subdomain'],
                        owner=user,
                        plan=plan
                    )

                return Response({
                    "message": "Oficina registrada com sucesso!",
                    "tenant_id": tenant.id,
                    "subdomain": tenant.subdomain
                }, status=status.HTTP_201_CREATED)

            except Plan.DoesNotExist:
                return Response({"error": "Plano inválido."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)