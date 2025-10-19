import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.model_settings import ModelSettings
from dotenv import load_dotenv

load_dotenv()

async def main():
    # Connect to your MCP server via MCPServerStreamableHttp
    async with MCPServerStreamableHttp(
        name="Weather Server",
        params={
            "url": "http://localhost:8000/mcp",
            # Optional: add headers like authentication tokens
            # "headers": {"Authorization": "Bearer YOUR_TOKEN"}
        },
        cache_tools_list=True,
    ) as server:
        # Define your agent with the MCP server
        agent = Agent(
            name="Weather Assistant",
            instructions="You are a helpful assistant. Use the available MCP tools to answer user queries about weather and math operations.",
            mcp_servers=[server],
            model_settings=ModelSettings(tool_choice="required"),
        )

        # Run the agent with a query
        result = await Runner.run(
            agent,
            "What is the weather forcast in London? Also, add 2 + 2. Please tell me what MCP tools are available."
        )
        print("\n🤖 Agent Response:\n", result.final_output)

if __name__ == "__main__":
    asyncio.run(main())