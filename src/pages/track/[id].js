import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TrackOrder() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/orders?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setError("Order not found");
        } else {
          setOrder(data);
        }
      });
  }, [id]);

  if (error) {
    return <p style={{ padding: 30, color: "red" }}>{error}</p>;
  }

  if (!order) {
    return <p style={{ padding: 30 }}>Loading order...</p>;
  }

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h1>Order Tracking</h1>

      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.total}</p>
      <p>
        <b>Tracking Number:</b>{" "}
        {order.trackingNumber || "Not assigned yet"}
      </p>
      <p><b>Payment Method:</b> {order.paymentMethod}</p>

      <hr />

      <h3>Items</h3>
      {order.items.map((item) => (
        <div key={item._id}>
          {item.name} × {item.qty}
        </div>
      ))}
    </div>
  );
}
