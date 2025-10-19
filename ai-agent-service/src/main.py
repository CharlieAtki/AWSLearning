from fastapi import FastAPI, Request
from pydantic import BaseModel
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.model_settings import ModelSettings

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    userData: dict | None = None

@app.get("/")
async def root():
    return {"message": "AI Agent Service is running"}

@app.post("/api/agent")
async def agent_chat(req: Request, data: ChatRequest):
    token = req.headers.get("authorization")

    async with MCPServerStreamableHttp(
        name="MCP Server",
        params={"url": "http://localhost:8000/mcp"},
        cache_tools_list=True,
    ) as server:
        agent = Agent(
            name="Customer Assistant",
            instructions="You are a helpful assistant that can call backend tools to carryout customer requests. For example, using the add_item_to_checkout tool to add an item to the checkout.",
            mcp_servers=[server],
            model_settings=ModelSettings(tool_choice="required"),
        )

        # The agent has access to token and user data if needed
        result = await Runner.run(
            agent,
            f"User message: {data.message}\nUser info: {data.userData}",
        )

    return {"response": result.final_output}
