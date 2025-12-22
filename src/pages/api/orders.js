import dbConnect from "../../lib/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  await dbConnect();

  // ================= CREATE ORDER =================
  if (req.method === "POST") {
    const order = await Order.create({
      ...req.body,
      status: req.body.status || "Pending",
      trackingNumber: null,
      trackingLink: null,
    });

    return res.status(201).json({
      success: true,
      orderId: order._id,
    });
  }

  // ================= GET ORDERS (ADMIN) =================
  if (req.method === "GET") {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  }

  // ================= UPDATE ORDER =================
  if (req.method === "PUT") {
    const { id, status, trackingNumber } = req.body;

    const update = {};
    if (status) update.status = status;

    if (trackingNumber) {
      update.trackingNumber = trackingNumber;
      update.trackingLink = `https://track.aftership.com/${trackingNumber}`;
    }

    await Order.findByIdAndUpdate(id, update);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
