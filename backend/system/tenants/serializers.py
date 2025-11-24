from rest_framework import serializers
from .models import Tenant, Plan
from accounts.models import User

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'price', 'features', 'is_active']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        ref_name = 'TenantUser' # Evita conflito de nomes no Swagger

class TenantSerializer(serializers.ModelSerializer):
    plan_details = PlanSerializer(source='plan', read_only=True)
    owner_details = UserSerializer(source='owner', read_only=True)

    class Meta:
        model = Tenant
        fields = [
            'id', 'name', 'subdomain', 'cnpj', 'status', 
            'owner', 'owner_details', 'plan', 'plan_details', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

class TenantRegistrationSerializer(serializers.Serializer):
    """
    Serializer específico para o cadastro inicial (Sign Up).
    Cria o Usuário e o Tenant atomicamente.
    """
    owner_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    office_name = serializers.CharField(max_length=255)
    subdomain = serializers.SlugField(max_length=100)
    plan_id = serializers.UUIDField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value

    def validate_subdomain(self, value):
        if Tenant.objects.filter(subdomain=value).exists():
            raise serializers.ValidationError("Este subdomínio não está disponível.")
        return value