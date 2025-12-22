import dbConnect from "../../lib/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  await dbConnect();

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // ----------------------------
  // GET (All orders OR single)
  // ----------------------------
  if (req.method === "GET") {
    const { id } = req.query;

    // 👉 Single order (for tracking page)
    if (id) {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.status(200).json({
        ...order.toObject(),
        trackingLink: `${BASE_URL}/track/${order._id}`,
      });
    }

    // 👉 All orders (admin)
    const orders = await Order.find().sort({ createdAt: -1 });

    const ordersWithTracking = orders.map((o) => ({
      ...o.toObject(),
      trackingLink: `${BASE_URL}/track/${o._id}`,
    }));

    return res.status(200).json(ordersWithTracking);
  }

  // ----------------------------
  // UPDATE order (status / tracking number)
  // ----------------------------
  if (req.method === "PUT") {
    const { id, status, trackingNumber } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Order ID required" });
    }

    const update = {};
    if (status) update.status = status;
    if (trackingNumber !== undefined)
      update.trackingNumber = trackingNumber;

    await Order.findByIdAndUpdate(id, update);

    return res.status(200).json({
      success: true,
      trackingLink: `${BASE_URL}/track/${id}`,
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
