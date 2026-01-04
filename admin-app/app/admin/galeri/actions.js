"use server";

import { createSupabaseServer } from "@/lib/supabase-server";

export async function insertGallery({ title, image_url }) {
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("gallery")
    .insert([{ title, image_url }]);

  if (error) {
    throw new Error(error.message);
  }
}
