import os
from supabase import create_client

SUPABASE_URL = "https://yfiyslodzryobhxfefys.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXlzbG9kenJ5b2JoeGZlZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNjk1MTQsImV4cCI6MjA3NTg0NTUxNH0.xiJHflgoAs1Sp7bKLjtpqh1UPzwVuhuQFagKJReUsYo"

email = "tmpuser@gmail.com"         # the user you created
password = "12345678"       # set this when you created the user

supabase = create_client(SUPABASE_URL, ANON_KEY)
res = supabase.auth.sign_in_with_password({"email": email, "password": password})

session = res.session
print("ACCESS TOKEN:\n", session.access_token)
