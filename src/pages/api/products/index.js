import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
