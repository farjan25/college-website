import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const SUPABASE_URL = "https://mvbmjfujbgkdibdhqdom.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Ym1qZnVqYmdrZGliZGhxZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDM4NTcsImV4cCI6MjA1NzM3OTg1N30.yn1gR46a3GzfbbER5ep14Jxsd4b9Mh2UnuavymUgvIM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);