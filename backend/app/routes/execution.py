from fastapi import APIRouter, HTTPException
from app.models.schemas import TraceRequest  # type: ignore
from app.tracer.engine import CodeTracer      # type: ignore

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