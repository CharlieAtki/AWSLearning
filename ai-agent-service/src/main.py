from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Optional
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.model_settings import ModelSettings
import os

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")

app = FastAPI()


class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    userData: Optional[dict] = None
    history: Optional[List[ChatMessage]] = []  # 🧠 past messages for context



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
            "You are a helpful assistant that can call backend tools to carry out customer requests. "
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

        # 🧠 Build conversation context
        conversation_context = ""
        if getattr(data, "history", None):
            for msg in data.history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                conversation_context += f"\n{role.title()}: {content}"
        else:
            conversation_context = f"\nUser: {data.message}"

        # 🗣 Run the agent with full conversational history
        prompt = (
            "This is an ongoing conversation between a customer and the assistant. "
            "Use the past messages to keep track of context (like products or quantities). "
            "Continue naturally from the last user message.\n\n"
            f"Conversation so far:{conversation_context}\n\n"
            f"User info: {data.userData}"
        )

        result = await Runner.run(agent, prompt)

    return {"response": result.final_output}