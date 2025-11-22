from django.contrib import admin
from .models import Tenant, Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain', 'status', 'owner', 'plan', 'created_at')
    list_filter = ('status', 'plan', 'created_at')
    search_fields = ('name', 'subdomain', 'cnpj', 'owner__email')
    prepopulated_fields = {'subdomain': ('name',)} # Preenche subdomain automático ao digitar nome
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Dados da Oficina', {
            'fields': ('id', 'name', 'subdomain', 'cnpj', 'status')
        }),
        ('Assinatura e Responsável', {
            'fields': ('owner', 'plan')
        }),
        ('Metadados', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )