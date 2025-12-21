import dbConnect from "../../lib/db";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const { name, price, stock, image } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      image,
    });

    return res.status(201).json(product);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
