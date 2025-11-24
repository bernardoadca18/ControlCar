import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Plan(models.Model):
    """
    Planos de assinatura (ex: Básico, Profissional).
    Ref: doc_arquitetura.docx
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Nome", max_length=100, unique=True)
    price = models.DecimalField("Preço Mensal", max_digits=10, decimal_places=2)
    features = models.JSONField("Funcionalidades", default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'plans'
        verbose_name = 'Plano'
        verbose_name_plural = 'Planos'

    def __str__(self):
        return f"{self.name} - R$ {self.price}"

class Tenant(models.Model):
    """
    Representa a Oficina Mecânica (Cliente do SaaS).
    """
    STATUS_ACTIVE = 'active'
    STATUS_INACTIVE = 'inactive'
    STATUS_SUSPENDED = 'suspended'
    
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Ativo'),
        (STATUS_INACTIVE, 'Inativo'),
        (STATUS_SUSPENDED, 'Suspenso'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Nome da Oficina", max_length=255)
    subdomain = models.SlugField("Subdomínio", max_length=100, unique=True)
    cnpj = models.CharField("CNPJ", max_length=18, unique=True, null=True, blank=True)
    status = models.CharField("Status", max_length=50, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT,
        related_name='owned_tenants',
        verbose_name="Proprietário (Owner)"
    )
    plan = models.ForeignKey(
        Plan, 
        on_delete=models.PROTECT,
        related_name='tenants',
        verbose_name="Plano Vigente",
        null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenants'
        verbose_name = 'Tenant (Oficina)'
        verbose_name_plural = 'Tenants (Oficinas)'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Garante que o subdomínio seja sempre slugificado
        if not self.subdomain:
            self.subdomain = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.subdomain})"