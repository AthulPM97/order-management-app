import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("orders").select(
      `
      *,
      orderproductmap:orderproductmap(orderId, productId)
    `
    );

    if (error) return res.status(500).json({ error: error.message });

    // Transform data to include product count
    const ordersWithProductCount = data.map((order) => ({
      ...order,
      productCount: order.orderproductmap.length, // Count products for each order
    }));

    return res.status(200).json(ordersWithProductCount);
  }

  if (req.method === "POST") {
    const { orderDescription, products } = req.body;

    // Insert a new order into the 'orders' table
    const orderResponse = await supabase
      .from("orders")
      .insert([{ orderDescription, createdAt: new Date().toISOString() }])
      .select("id"); // Retrieve the newly inserted order's ID

    const { data: orderData, error: orderError } = orderResponse;

    if (orderError) {
      console.error("Order Insert Error:", orderError.message);
      return res.status(500).json({ error: orderError.message });
    }

    const orderId = orderData[0].id; // Get the inserted order's ID

    // Prepare data for the 'orderproductmap' table
    const orderProductMapData = products.map((productId) => ({
      orderId,
      productId,
    }));

    // Insert into the 'orderproductmap' table
    const mapResponse = await supabase
      .from("orderproductmap")
      .insert(orderProductMapData);

    const { error: mapError } = mapResponse;

    if (mapError) {
      console.error("Order Product Map Insert Error:", mapError.message);
      return res.status(500).json({ error: mapError.message });
    }

    const { data: finalData, error: finalError } = await supabase.from("orders")
      .select(`
      *, orderproductmap(*)
    `);

    if (finalError) {
      console.error("Final Insert Error:", finalError.message);
      return res.status(500).json({ error: finalError.message });
    }
    // Return the order and its mapped products as a response
    return res.status(201).json(finalData);
  }

  res.status(405).json({ error: "Method not allowed" });
}
