import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  }

  if (req.method === "PUT") {
    const { id, status } = req.body;

    if (!["Paid", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await Order.findByIdAndUpdate(id, { status });
    return res.json({ success: true });
  }

  res.status(405).end();
}
