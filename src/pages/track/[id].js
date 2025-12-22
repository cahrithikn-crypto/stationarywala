import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function TrackOrder() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch("/api/orders")
      .then((res) => res.json())
      .then((orders) => {
        const found = orders.find((o) => o._id === id);
        setOrder(found);
      });
  }, [id]);

  if (!order) {
    return (
      <>
        <Header />
        <p style={{ padding: 40 }}>Loading order...</p>
      </>
    );
  }

  return (
    <>
      <Header />

      <div style={{ padding: 40, maxWidth: 600, margin: "auto" }}>
        <h1>📦 Order Tracking</h1>

        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Payment:</b> {order.paymentMethod}</p>

        {order.trackingLink && (
          <p>
            <b>Tracking Link:</b>{" "}
            <a href={order.trackingLink} target="_blank">
              Track Shipment
            </a>
          </p>
        )}

        <h3>Items</h3>
        {order.items.map((i) => (
          <div key={i._id}>
            {i.name} × {i.qty}
          </div>
        ))}

        <h3>Total: ₹{order.total}</h3>
      </div>
    </>
  );
}
