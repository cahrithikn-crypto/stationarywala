import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: Array,
    total: Number,
    paymentId: String
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

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
