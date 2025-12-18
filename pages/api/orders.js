import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  }

  if (req.method === "GET") {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  }

  res.status(405).json({ message: "Method not allowed" });
}
