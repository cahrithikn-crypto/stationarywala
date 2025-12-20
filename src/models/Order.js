import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: Array,
    total: Number,
    paymentId: String,
    status: {
      type: String,
      default: "paid"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
