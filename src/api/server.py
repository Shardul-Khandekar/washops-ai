from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.agents.receptionist import receptionist_app

app = FastAPI(title="Car Wash AI Receptionist")

class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # user id should be used as LangGraph thread
        config = {"configurable": {"thread_id": request.user_id}}

        input_state = {"messages": [("user", request.message)]}
        output = receptionist_app.invoke(input_state, config=config)

        return {
            "response": output["messages"][-1].content,
            "thread_id": request.user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))