import os, time, httpx
from functools import lru_cache
from jose import jwt
from fastapi import HTTPException

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")           # for HS256 projects
JWKS_URL   = os.getenv("SUPABASE_JWKS_URL")             # only used if alg is RS256/ES256

@lru_cache(maxsize=1)
def _jwks():
    if not JWKS_URL:
        return None
    r = httpx.get(JWKS_URL, timeout=5)
    r.raise_for_status()
    return r.json()

def verify_supabase_jwt(token: str) -> dict:
    # Peek at header to decide verification method
    header = jwt.get_unverified_header(token)
    alg = header.get("alg")

    try:
        if alg == "HS256":
            if not JWT_SECRET:
                raise HTTPException(status_code=500, detail="Missing SUPABASE_JWT_SECRET")
            claims = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})

        else:
            jwks = _jwks()
            if not jwks:
                raise HTTPException(status_code=500, detail="Missing JWKS for asymmetric JWT")
            kid = header.get("kid")
            key = next((k for k in jwks["keys"] if k.get("kid") == kid), None)
            if not key:
                raise HTTPException(status_code=401, detail="Invalid token (kid)")
            claims = jwt.decode(token, key, algorithms=[key["alg"]], options={"verify_aud": False})

    except Exception:
        # Signature/format invalid
        raise HTTPException(status_code=401, detail="Invalid token")

    if claims.get("exp", 0) < time.time():
        raise HTTPException(status_code=401, detail="Token expired")

    return claims
