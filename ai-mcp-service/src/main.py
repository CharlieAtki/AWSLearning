from fastmcp import FastMCP
import requests

# Define the MCP server
mcp = FastMCP("Weather Server")


@mcp.tool()
def get_weather(city: str) -> str:
    """Fetches the current weather for the specified city."""
    try:
        endpoint = "https://wttr.in"
        response = requests.get(f"{endpoint}/{city}?format=3", timeout=5)
        return response.text if response.status_code == 200 else "Could not fetch weather"
    except Exception as e:
        return f"Error fetching weather: {str(e)}"


@mcp.tool()
def add_numbers(a: int, b: int) -> int:
    """Adds two numbers together."""
    return a + b


@mcp.tool()
def get_weather_forecast(city: str) -> str:
    """Gets a 3-day weather forecast for the specified city."""
    try:
        endpoint = "https://wttr.in"
        response = requests.get(f"{endpoint}/{city}?format=j1", timeout=5)
        if response.status_code == 200:
            data = response.json()
            current = data.get("current_condition", [{}])[0]
            forecast = data.get("weather", [])[:3]

            result = f"Current: {current.get('description', 'N/A')}, Temp: {current.get('temp_C', 'N/A')}°C\n"
            result += "3-Day Forecast:\n"
            for day in forecast:
                date = day.get("date", "")
                desc = day.get("hourly", [{}])[0].get("condition", {}).get("description", "N/A")
                avg_temp = day.get("avgtemp_c", "N/A")
                result += f"  {date}: {desc}, Avg: {avg_temp}°C\n"
            return result
        return "Could not fetch forecast"
    except Exception as e:
        return f"Error fetching forecast: {str(e)}"

@mcp.tool()
def add_item_to_checkout(item_name: str, quantity: int):
    """Adds an item to the customer's checkout."""
    return f"Added {quantity} {item_name} to checkout"


# Run the MCP server with SSE transport
if __name__ == "__main__":
    # The server will be available at http://localhost:8000/sse by default
    mcp.run(transport="http", port=8000)
