from fastapi import FastAPI
from routes import profiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Elara Backend", version="0.0.1")
app.include_router(profiles.router)

# Dev origins (add/remove as needed)
ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Expo web/Next dev
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],             # or ["GET","POST","OPTIONS"]
    allow_headers=["*"],             # includes Authorization, Content-Type
    expose_headers=[],               # usually not needed
    max_age=600,                     # cache the preflight for 10m
)


@app.get("/health")
def health():
    return {"ok": True}
