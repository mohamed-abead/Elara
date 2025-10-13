import os
from supabase import create_client

SUPABASE_URL = "https://khfjumqlmkvjlzbrajrb.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZmp1bXFsbWt2amx6YnJhanJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDA4MzksImV4cCI6MjA3NTg3NjgzOX0.5mTzrQF_XkGam5TEBnII5u6kKdv9TgK7wLj8nnZ80iI"

email = "tmpuser@gmail.com"         # the user you created
password = "12345678"       # set this when you created the user

supabase = create_client(SUPABASE_URL, ANON_KEY)
res = supabase.auth.sign_in_with_password({"email": email, "password": password})

session = res.session
print("ACCESS TOKEN:\n", session.access_token)
