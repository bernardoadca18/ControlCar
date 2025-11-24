from django.contrib import admin
from .models import Tenant, Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain', 'status_badge', 'owner_link', 'plan', 'created_at')
    list_filter = ('status', 'plan', 'created_at')
    search_fields = ('name', 'subdomain', 'cnpj', 'owner__email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    autocomplete_fields = ['owner', 'plan'] # Performance para muitos usuários
    
    fieldsets = (
        ('Dados da Oficina', {
            'fields': ('id', 'name', 'subdomain', 'cnpj', 'status')
        }),
        ('Assinatura', {
            'fields': ('owner', 'plan')
        }),
        ('Metadados', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    @admin.display(description='Status', ordering='status')
    def status_badge(self, obj):
        # Pode-se retornar HTML aqui para colorir o status se desejar
        return obj.get_status_display()

    @admin.display(description='Proprietário', ordering='owner')
    def owner_link(self, obj):
        return obj.owner.email