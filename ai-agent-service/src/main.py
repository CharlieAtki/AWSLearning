import os
from openai import OpenAI
from mcp import ClientSession
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8081")  # default

# Initialize OpenAI Agent SDK client
client = OpenAI(api_key=OPENAI_API_KEY)


# Create an MCP session to connect to your FastMCP server
async def init_mcp():
    session = ClientSession()
    await session.connect_http(MCP_SERVER_URL)
    print("✅ Connected to MCP Server")
    return session


# Example agent function
async def handle_message(user_message: str):
    session = await init_mcp()

    # Here, you could call a tool exposed by MCP
    result = await session.call_tool("add_item_to_order", {
        "order_id": "1234",
        "item_name": "Cappuccino",
        "quantity": 2
    })

    # Send to OpenAI agent (reasoning, context)
    completion = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are an AI cafe assistant."},
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": f"I’ve added: {result}"}
        ]
    )

    return completion.choices[0].message.content


if __name__ == "__main__":
    import asyncio

    response = asyncio.run(handle_message("Can you add two cappuccinos to order 1234?"))
    print("🤖 Agent:", response)
