from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.execution import router as execution_router

app = FastAPI(title="Debuggy Core Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(execution_router)

@app.get("/")
def read_root():
    return {"status": "Debuggy API Engine Online", "version": "1.0.0"}