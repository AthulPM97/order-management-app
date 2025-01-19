import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { orderDescription } = req.body;
    const { data, error } = await supabase
      .from("orders")
      .update({ orderDescription })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).send();
  }

  res.status(405).json({ error: "Method not allowed" });
}
