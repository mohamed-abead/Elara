import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://yfiyslodzryobhxfefys.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXlzbG9kenJ5b2JoeGZlZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNjk1MTQsImV4cCI6MjA3NTg0NTUxNH0.xiJHflgoAs1Sp7bKLjtpqh1UPzwVuhuQFagKJReUsYo"
);
