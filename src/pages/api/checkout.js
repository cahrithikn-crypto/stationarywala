import dbConnect from "../../lib/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { items, total } = req.body;

    // Create order
    const order = await Order.create({
      items,
      total,
      status: "Paid", // or "COD Pending" later
    });

    // Auto tracking link
    const trackingLink = `/track/${order._id}`;

    return res.status(200).json({
      success: true,
      orderId: order._id,
      trackingLink,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Order creation failed" });
  }
}
