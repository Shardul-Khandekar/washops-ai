import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from store import KnowledgeStore
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(title="Intelligence Service")
store = KnowledgeStore()

# Define SCHEMA
class SyncRequest(BaseModel):
    owner_email: str
    wash_id: int
    data_points: List[Dict[str, Any]]

@app.post("/sync")
async def sync_knowledge(request: SyncRequest):
    try:
        count = store.sync_wash_data(
            owner_email=request.owner_email,
            wash_id=request.wash_id,
            documents=request.data_points
        )
        return {
            "success": True, 
            "message": f"Successfully synced {count} chunks for wash {request.wash_id}"
        }
    except Exception as e:
        print(f"Sync Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "online"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
