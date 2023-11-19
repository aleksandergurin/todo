import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

INCORRECT_USER_OR_PASSWD = "Incorrect username or password."


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse(
            {"message": INCORRECT_USER_OR_PASSWD},
            status=400,
        )

    user = authenticate(
        username=username,
        password=password,
    )

    if user is None:
        return JsonResponse(
            {"message": INCORRECT_USER_OR_PASSWD},
            status=400,
        )

    login(request, user)
    return JsonResponse({"message": "Successfully logged in."})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"message": "Not logged in."},
            status=400,
        )

    logout(request)
    return JsonResponse({"message": "Logged out."})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({
        "isAuthenticated": True,
        "username": request.user.username,
    })


@api_view(["GET"])
def csrf(request):
    response = Response({"message": "CSRF cookie set"})
    response["X-CSRFToken"] = get_token(request)
    return response
