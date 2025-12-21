import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: Array,
    total: Number,
    paymentId: String,

    status: {
      type: String,
      enum: ["Paid", "Shipped", "Delivered"],
      default: "Paid"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
