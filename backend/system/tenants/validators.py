import re
from django.core.exceptions import ValidationError

def validate_subdomain(value):
    """
    Valida se o subdomínio é seguro para URL e não é uma palavra reservada.
    """
    if not re.match(r'^[a-z0-9-]+$', value):
        raise ValidationError("O subdomínio deve conter apenas letras minúsculas, números e hífens.")
    
    if value.startswith('-') or value.endswith('-'):
        raise ValidationError("O subdomínio não pode começar ou terminar com hífen.")
    
    # Palavras reservadas que não podem ser tenants
    reserved_words = [
        'admin', 'api', 'www', 'controlcar', 'dashboard', 'app', 'public', 
        'assets', 'static', 'media', 'login', 'auth'
    ]
    if value in reserved_words:
        raise ValidationError(f"O subdomínio '{value}' não está disponível para uso.")