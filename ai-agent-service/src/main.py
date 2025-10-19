import asyncio
import os
from agents import Agent, Runner
from agents.mcp import MCPServer, MCPServerStdio
from dotenv import load_dotenv

load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")

mcp_weather_fetch = MCPServerStdio(
    params={
        "command": "uvx",
        "args": [f"{MCP_SERVER_URL}"]
    }
)

async def handle_request(request):
    agent = Agent(
        name="Assistant",
        instructions="""You are a helpful assistant and would use tools to help the user. Use the mcp_weather_fetch tool to get the weather forecast. Pass the users specified city / location as an argument to the tool.""",
        mcp_servers=[mcp_weather_fetch],
    )

    result = await Runner.run(agent, request)

    print(result.final_output)

if __name__ == '__main__':
    asyncio.run(handle_request("""Please give me the weather forecast for the next 7 days in Leeds."""))

