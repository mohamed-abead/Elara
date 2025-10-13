import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://khfjumqlmkvjlzbrajrb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZmp1bXFsbWt2amx6YnJhanJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDA4MzksImV4cCI6MjA3NTg3NjgzOX0.5mTzrQF_XkGam5TEBnII5u6kKdv9TgK7wLj8nnZ80iI"
);
