import dbConnect from "../../lib/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  }

  if (req.method === "PUT") {
    const { id, status, trackingNumber } = req.body;

    const update = {};
    if (status) update.status = status;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;

    await Order.findByIdAndUpdate(id, update);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
