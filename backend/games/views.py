from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Game
from .serializers import GameSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all().order_by("-created_at")
    serializer_class = GameSerializer

    def get_permissions(self):
        # Anyone can read; only admins can create, edit or delete
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]