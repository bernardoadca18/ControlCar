from django.shortcuts import render

from rest_framework import generics, permissions
from .serializers import UserSerializer

class UserProfileView(generics.RetrieveAPIView):
    """
    Retorna os dados do usuário autenticado.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user