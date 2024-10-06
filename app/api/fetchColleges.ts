// fetchColleges.ts
// import { supabase } from './supabaseClient';
import { createClient } from "@/utils/supabase/client";

export const fetchColleges = async () => {
  const { data, error } = await createClient()
    .from('colleges')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching colleges:', error);
    return [];
  }

  return data;
};