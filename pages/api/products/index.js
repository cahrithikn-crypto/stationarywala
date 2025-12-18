import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/Product";


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

  res.status(405).json({ message: "Method not allowed" });
}
