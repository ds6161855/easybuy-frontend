import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tgzdryetwpwyznhdyoqx.supabase.co",
  "sb_publishable_ubBoDkkPL978MsHZMwQBjQ_rMy-NcKD"
);

export default supabase;
