from fastmcp import tool
import requests
import os

CAFE_API_URL = os.getenv("CAFE_API_URL")

@tool
def get_menu_items():
    """Get all available menu items from the cafe system."""
    response = requests.get(f"{CAFE_API_URL}/api/menu")
    return response.json()
