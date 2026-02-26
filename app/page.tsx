import { supabase } from "@/lib/supabaseClient";

export default async function Page() {
  const { data, error } = await supabase.from("test").select("*");

  console.log(data, error);

  return (
    <main className="p-6">
      <h1>Supabase Connected ✅</h1>
    </main>
  );
}