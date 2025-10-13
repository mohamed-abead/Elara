from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, Header, HTTPException
from typing import Annotated
from auth import verify_supabase_jwt
from supabase_client import postgrest_as_user


app = FastAPI(title="MVP Backend", version="0.0.1")

def current_user(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ")[-1]
    return {"token": token, "claims": verify_supabase_jwt(token)}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/me")
def me(user = Depends(current_user)):
    c = user["claims"]
    return {"sub": c.get("sub"), "email": c.get("email"), "provider": c.get("app_metadata", {}).get("provider")}

@app.post("/profiles/me")
def upsert_my_profile(payload: dict, user=Depends(current_user)):
    body = {
        "id": user["claims"]["sub"],
        "full_name": payload.get("full_name"),
        "avatar_url": payload.get("avatar_url"),
    }
    with postgrest_as_user(user["token"]) as pg:
        r = pg.post("/profiles", json=body, params={"on_conflict": "id"})
        return r.json()

@app.get("/profiles/me")
def get_my_profile(user=Depends(current_user)):
    with postgrest_as_user(user["token"]) as pg:
        r = pg.get("/profiles", params={"select": "*", "id": f"eq.{user['claims']['sub']}"})
        return r.json()