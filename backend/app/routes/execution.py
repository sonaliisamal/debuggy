import os
import sys
from fastapi import APIRouter, HTTPException

# Dynamically force Python to see where this file lives locally
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import cleanly via localized namespace paths
from models.schemas import TraceRequest
from tracer.engine import CodeTracer

router = APIRouter(prefix="/api", tags=["Execution Engine"])

@router.post("/trace")
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
            detail=f"Execution error or syntax bug: {str(e)}"
        )