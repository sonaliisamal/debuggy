from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Debuggy Core Engine API")

# Allow our React frontend to request data safely later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Debuggy API Engine Online", "version": "1.0.0"}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.execution import router as execution_router

app = FastAPI(title="Debuggy Core Engine API")

# Allow our React frontend to request data safely over the local network ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Plug in our newly created execution router engine module
app.include_router(execution_router)

@app.get("/")
def read_root():
    return {"status": "Debuggy API Engine Online", "version": "1.0.0"}