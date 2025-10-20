from fastmcp import FastMCP
import requests
import os
from typing import Any, Dict

# Define the MCP server
mcp = FastMCP("Backend Tools Server")

EXPRESS_BASE_URL = os.getenv("EXPRESS_BASE_URL", "http://localhost:3000")

# Store token from context if available
_token = None

def set_token(token: str):
    """Set the authentication token for requests"""
    global _token
    _token = token.strip()
    if _token.startswith("Bearer "):
        # Normalize to raw token internally
        _token = _token[7:]

# Try to capture session params (including token) when a client connects.
# Some FastMCP versions expose a connection hook; we defensively support multiple shapes.
try:
    # Newer-style API: decorator-based
    @mcp.on_connect
    def _on_connect(session: Any):  # type: ignore
        try:
            params: Dict[str, Any] = {}
            # Common attribute names across implementations
            for attr in ("params", "client_params", "connection_params", "metadata"):
                if hasattr(session, attr) and isinstance(getattr(session, attr), dict):
                    params.update(getattr(session, attr))
            token = params.get("token") or params.get("auth") or params.get("authorization")
            if token:
                set_token(str(token))
        except Exception:
            # Best-effort only; continue without blocking
            pass
except Exception:
    # If on_connect isn't available, we'll rely on the explicit tool below
    pass

@mcp.tool()
def set_auth_token(token: str):
    """
    Sets the authentication token to be used when calling protected backend endpoints.
    Pass either the raw JWT or the full "Bearer <token>" string.
    """
    set_token(token)
    # Do not echo the token back in responses
    return "✅ Authentication token received and set."

@mcp.tool()
def search_product_by_name(product_name: str):
    """
    Searches for a product by name and returns its MongoDB ObjectId and details.
    Use this to find the product_id before adding to checkout.
    """
    try:
        endpoint = f"{EXPRESS_BASE_URL}/api/product-unAuth/getAllProducts"
        response = requests.get(endpoint, timeout=5)

        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])

            # Search for product by name (case-insensitive)
            matching = [
                p for p in products
                if product_name.lower() in p.get('productName', '').lower()
            ]

            if matching:
                product = matching[0]
                return f"✅ Found: {product.get('productName')} | ID: {product.get('_id')} | Price: £{product.get('price', 'N/A')}"
            else:
                return f"❌ Product '{product_name}' not found in catalog"
        else:
            return f"❌ Failed to search products (Status: {response.status_code})"

    except Exception as e:
        return f"⚠️ Error searching products: {str(e)}"


@mcp.tool()
def add_item_to_checkout(product_id: str, product_name: str, quantity: int, user_email: str):
    """
    Adds an item to the user's checkout basket.

    Args:
        product_id: The MongoDB ObjectId of the product (must be 24 hex characters)
        product_name: The name of the product (for reference)
        quantity: How many items to add (default: 1)
        user_email: The email of the user making the purchase

    Important: Always search for the product first using search_product_by_name()
    to get the correct product_id before calling this function.
    """

    try:
        # Validate ObjectId format (should be 24 character hex string)
        if not isinstance(product_id, str) or len(product_id) != 24:
            return f"❌ Invalid product ID format. Expected 24-character hex string, got: {product_id}"

        # Check if token is available
        if not _token:
            return "❌ Authentication token not available. Please ensure you're logged in."

        payload = {
            "productId": product_id,
            "productName": product_name,
            "userEmail": user_email,
            "quantity": int(quantity)
        }

        headers = {
            "Authorization": f"Bearer {_token}",  # Token is raw, so add Bearer prefix
            "Content-Type": "application/json"
        }

        endpoint = f"{EXPRESS_BASE_URL}/api/user-auth/addItemToCheckout"
        response = requests.post(endpoint, json=payload, headers=headers, timeout=10)

        if response.status_code == 200:
            data = response.json()
            return f"✅ {data.get('message', 'Item added successfully to checkout!')}"
        else:
            # try to parse json message if present
            error_msg = None
            try:
                error_msg = response.json().get('message')
            except Exception:
                pass
            if not error_msg:
                error_msg = response.text
            return f"❌ Failed to add item: {error_msg} (Status: {response.status_code})"

    except Exception as e:
        return f"⚠️ Error adding item to checkout: {str(e)}"

# Run the MCP server with HTTP transport
if __name__ == "__main__":
    # The server will be available at http://localhost:8000/mcp by default for HTTP transport
    mcp.run(transport="http", port=8000)