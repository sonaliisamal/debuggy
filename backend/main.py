import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 1. SYSTEM PATH ALIGNMENT ---
# This forces Python to look right inside the app folder for the tracer engine
backend_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(backend_dir, "app")
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

# Safely grab the code tracer engine from app/tracer/engine.py
# Safely grab the code tracer engine from app/tracer/engine.py
from tracer.engine import CodeTracer  # type: ignore

# --- 2. DATA SCHEMAS ---
class TraceRequest(BaseModel):
    code: str
    function_call: str

# --- 3. APPLICATION INIT ---
app = FastAPI(title="Debuggy Core Engine API")

# Setup CORS so your Vite React frontend can talk to this API safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. API ROUTES ---
@app.post("/api/trace")
def trace_code_execution(payload: TraceRequest):
    try:
        tracer = CodeTracer()
        execution_steps = tracer.run_code(payload.code, payload.function_call)
        
        return {
            "success": True,
            "total_steps": len(execution_steps),
            "trace": execution_steps
        }
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Execution engine failure or script syntax bug: {str(e)}"
        )

@app.get("/")
def read_root():
    return {"status": "Debuggy API Engine Online", "version": "1.0.0"}