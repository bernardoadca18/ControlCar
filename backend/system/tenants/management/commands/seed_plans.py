from django.core.management.base import BaseCommand
from tenants.models import Plan

class Command(BaseCommand):
    help = 'Popula o banco de dados com os planos padrão do SaaS'

    def handle(self, *args, **kwargs):
        plans = [
            {
                "name": "Básico",
                "price": 149.00,
                "features": {"users": 2, "support": "email"}
            },
            {
                "name": "Profissional",
                "price": 219.00,
                "features": {"users": 10, "support": "whatsapp", "reports": True}
            },
        ]

        for p_data in plans:
            plan, created = Plan.objects.get_or_create(
                name=p_data['name'],
                defaults={'price': p_data['price'], 'features': p_data['features']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Plano "{plan.name}" criado com sucesso.'))
            else:
                self.stdout.write(f'Plano "{plan.name}" já existe.')