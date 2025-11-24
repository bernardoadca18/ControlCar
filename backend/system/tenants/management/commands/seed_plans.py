from django.core.management.base import BaseCommand
from tenants.models import Plan

class Command(BaseCommand):
    help = 'Popula o banco de dados com planos de assinatura padrão.'

    def handle(self, *args, **options):
        plans = [
            {
                "name": "Básico",
                "price": 99.90,
                "features": {
                    "max_users": 2,
                    "max_vehicles": 100,
                    "support": "email",
                    "reports": False
                }
            },
            {
                "name": "Profissional",
                "price": 199.90,
                "features": {
                    "max_users": 5,
                    "max_vehicles": 500,
                    "support": "whatsapp",
                    "reports": True
                }
            },
            {
                "name": "Enterprise",
                "price": 499.90,
                "features": {
                    "max_users": 999,
                    "max_vehicles": 9999,
                    "support": "24h",
                    "reports": True,
                    "api_access": True
                }
            }
        ]

        for p_data in plans:
            plan, created = Plan.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'price': p_data['price'],
                    'features': p_data['features']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Plano criado: {plan.name}'))
            else:
                self.stdout.write(f'Plano já existe: {plan.name}')

        self.stdout.write(self.style.SUCCESS('Seed de planos concluído com sucesso!'))