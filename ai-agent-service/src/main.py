from fastapi import FastAPI, Request
from pydantic import BaseModel
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.model_settings import ModelSettings
import os
import dotenv

load_dotenv = dotenv.load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")

app = FastAPI()


class ChatRequest(BaseModel):
    message: str
    userData: dict | None = None


@app.get("/")
async def root():
    return {"message": "AI Agent Service is running"}


@app.post("/api/agent")
async def agent_chat(req: Request, data: ChatRequest):
    # Extract token from header - it should be just the raw token
    auth_header = req.headers.get("authorization", "")
    token = auth_header.strip() if auth_header else ""

    # If it still has "Bearer" prefix, remove it
    if token.startswith("Bearer "):
        token = token[7:]  # Remove "Bearer " prefix

    async with MCPServerStreamableHttp(
            name="MCP Server",
            params={
                "url": MCP_SERVER_URL,
                "token": token,  # Pass token to MCP params
            },
            cache_tools_list=True,
    ) as server:
        instructions = (
            "You are a helpful assistant that can call backend tools to carryout customer requests. "
            "For example, using the add_item_to_checkout tool to add an item to the checkout. "
            "Before calling any protected backend tool (those that require authentication), you must first call the MCP tool "
            "set_auth_token with the session token provided below. Never reveal the token to the user, never print it, and use it only for tool calls.\n"
            f"SESSION_AUTH_TOKEN: {token}"
        )

        agent = Agent(
            name="Customer Assistant",
            instructions=instructions,
            mcp_servers=[server],
            model_settings=ModelSettings(tool_choice="required"),
        )

        # The agent has access to token and user data if needed
        result = await Runner.run(
            agent,
            f"User message: {data.message}\nUser info: {data.userData}",
        )

    return {"response": result.final_output}