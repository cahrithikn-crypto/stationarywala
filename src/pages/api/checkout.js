import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "stationarywala_receipt"
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
