from django.conf import settings
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests


GEO_API_URL_TEMPLATE = (
    f"https://api.openweathermap.org/geo/1.0/direct"
    f"?q={{city}}"
    f"&limit=10"
    f"&appid={settings.WEATHER_API_KEY}"
)

WEATHER_API_URL_TEMPLATE = (
    f"https://api.openweathermap.org/data/2.5/weather"
    f"?units=metric"
    f"&q={{city_state_country}}"
    f"&appid={settings.WEATHER_API_KEY}"
)


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def geo(request, city):
    url = GEO_API_URL_TEMPLATE.format(city=city)
    resp = requests.get(url)

    if resp.status_code == status.HTTP_200_OK:
        return Response({
            "data": resp.json(),
        })

    return Response(
        {
            "message": "Could not get geo data",
            "service_resp_code": resp.status_code,
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def weather(request, location):
    url = WEATHER_API_URL_TEMPLATE.format(city_state_country=location)
    resp = requests.get(url)

    if resp.status_code == status.HTTP_200_OK:
        return Response({
            "data": resp.json(),
        })

    return Response(
        {
            "message": "Could not get weather data",
            "service_resp_code": resp.status_code,
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )
