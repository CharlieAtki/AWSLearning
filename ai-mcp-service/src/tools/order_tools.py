from fastmcp import tool
import requests
import os

CAFE_API_URL = os.getenv("CAFE_API_URL")

@tool
def add_item_to_order(order_id: str, item_name: str, quantity: int):
    """Adds an item to a customer order."""
    response = requests.post(
        f"{CAFE_API_URL}/api/orders/{order_id}/add-item",
        json={"itemName": item_name, "quantity": quantity},
        headers={"Authorization": f"Bearer {os.getenv('SERVICE_API_KEY')}"}
    )
    return response.json()


@tool
def get_order_status(order_id: str):
    """Retrieves the current status of an order."""
    response = requests.get(f"{CAFE_API_URL}/api/orders/{order_id}")
    return response.json()
