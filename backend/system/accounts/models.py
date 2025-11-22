import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Usuário do Painel de Controle (Public Schema).
    Geralmente representa o dono da oficina (Owner) ou Admins do SaaS.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Campos adicionais
    
    class Meta:
        db_table = 'auth_user' # Mantém padrão ou muda para 'users' se preferir
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

    def __str__(self):
        return self.email