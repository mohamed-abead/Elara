import os, httpx

SUPABASE_URL = os.environ["SUPABASE_URL"]
ANON_KEY = os.environ["SUPABASE_ANON_KEY"]

def postgrest_as_user(access_token: str) -> httpx.Client:
    """Client that calls Supabase REST API using the user's token."""
    return httpx.Client(
        base_url=f"{SUPABASE_URL}/rest/v1",
        headers={
            "Authorization": f"Bearer {access_token}",
            "apikey": ANON_KEY,
        },
        timeout=10,
    )
