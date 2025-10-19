from fastmcp import FastMCP
from tools.order_tools import add_item_to_order, get_order_status
from tools.menu_tools import get_menu_items

app = FastMCP(name="Cafe AI Service")

# Register tools
app.add_tool(add_item_to_order)
app.add_tool(get_order_status)
app.add_tool(get_menu_items)

if __name__ == "__main__":
    app.run()
