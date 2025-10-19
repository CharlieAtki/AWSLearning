from fastmcp import FastMCP
import requests
import os

# Define the MCP server
mcp = FastMCP("Weather Server")


EXPRESS_BASE_URL = os.getenv("EXPRESS_BASE_URL", "http://localhost:3000")

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
def add_item_to_checkout(product_id: str, product_name: str, quantity: int, user_email: str, token: str):
    """
    Adds an item to the user's checkout basket.

    Args:
        product_id: The MongoDB ObjectId of the product (must be 24 hex characters)
        product_name: The name of the product (for reference)
        quantity: How many items to add (default: 1)
        user_email: The email of the user making the purchase
        token: JWT authentication token from the user

    Important: Always search for the product first using search_product_by_name()
    to get the correct product_id before calling this function.
    """

    try:
        # Validate ObjectId format (should be 24 character hex string)
        if not isinstance(product_id, str) or len(product_id) != 24:
            return f"❌ Invalid product ID format. Expected 24-character hex string, got: {product_id}"

        payload = {
            "productId": product_id,  # Must be valid MongoDB ObjectId
            "productName": product_name,
            "userEmail": user_email,
            "quantity": int(quantity)
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        endpoint = f"{EXPRESS_BASE_URL}/api/user-auth/addItemToCheckout"
        response = requests.post(endpoint, json=payload, headers=headers, timeout=10)

        if response.status_code == 200:
            data = response.json()
            return f"✅ {data.get('message', 'Item added successfully to checkout!')}"
        else:
            error_msg = response.json().get('message', response.text)
            return f"❌ Failed to add item: {error_msg}"

    except Exception as e:
        return f"⚠️ Error adding item to checkout: {str(e)}"

# Run the MCP server with SSE transport
if __name__ == "__main__":
    # The server will be available at http://localhost:8000/sse by default
    mcp.run(transport="http", port=8000)
