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
    const { orderDescription, products } = req.body;
    // Step 1: Update the `orders` table
    const { data: updatedOrder, error: orderError } = await supabase
      .from("orders")
      .update({ orderDescription })
      .eq("id", id);

    if (orderError) {
      return res.status(500).json({ error: orderError.message });
    }

    // Step 2: Remove existing mappings from `orderproductmap`
    const { error: deleteError } = await supabase
      .from("orderproductmap")
      .delete()
      .eq("orderId", id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    // Step 3: Add new mappings to `orderproductmap`
    const orderProductMapData = products.map((productId) => ({
      orderId: id,
      productId,
    }));

    const { error: insertError } = await supabase
      .from("orderproductmap")
      .insert(orderProductMapData);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    // Step 4: Return the updated order and new mappings
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *, orderproductmap(*)
    `
      )
      .eq("id", id)
      .single();
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
