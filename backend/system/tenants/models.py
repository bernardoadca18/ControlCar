import uuid
from django.db import models
from django.conf import settings

class Plan(models.Model):
    """
    Representa os planos de assinatura (ex: Básico, Profissional).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Nome", max_length=100, unique=True)
    price = models.DecimalField("Preço", max_digits=10, decimal_places=2)
    features = models.JSONField("Funcionalidades", default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'plans'
        verbose_name = 'Plano'
        verbose_name_plural = 'Planos'

    def __str__(self):
        return f"{self.name} (R$ {self.price})"

class Tenant(models.Model):
    """
    Representa a Oficina Mecânica (Cliente do SaaS).
    """
    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('inactive', 'Inativo'),
        ('suspended', 'Suspenso'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Nome da Oficina", max_length=255)
    subdomain = models.SlugField("Subdomínio", max_length=100, unique=True)
    cnpj = models.CharField("CNPJ", max_length=18, unique=True, null=True, blank=True)
    status = models.CharField("Status", max_length=50, choices=STATUS_CHOICES, default='active')
    
    # Relacionamentos
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, # Não deletar o tenant se o usuário for deletado (segurança)
        related_name='tenants',
        verbose_name="Proprietário"
    )
    plan = models.ForeignKey(
        Plan, 
        on_delete=models.PROTECT, # Não deletar o plano se houver tenants usando
        related_name='tenants',
        verbose_name="Plano de Assinatura",
        null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenants'
        verbose_name = 'Tenant (Oficina)'
        verbose_name_plural = 'Tenants (Oficinas)'

    def __str__(self):
        return f"{self.name} ({self.subdomain})"