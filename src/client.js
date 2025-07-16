import { createClient } from '@supabase/supabase-js';
const URL = 'https://xzsdxsstdxaeqfhebayh.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6c2R4c3N0ZHhhZXFmaGViYXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODg1NTcsImV4cCI6MjA2ODE2NDU1N30.k0jxKmvCA7A5myCO4Grx_qYgsNksp-KR5VsqAOpYKck';
export const supabase = createClient(URL, API_KEY);
