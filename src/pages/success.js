import { useRouter } from "next/router";
import Link from "next/link";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  if (!orderId) return null;

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>✅ Order Placed Successfully</h1>

      <p>
        <strong>Order ID:</strong>
        <br />
        <code>{orderId}</code>
      </p>

      <p style={{ marginTop: 20 }}>
        Track your order here:
      </p>

      <Link href={`/track/${orderId}`}>
        <button
          style={{
            padding: "10px 20px",
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Track Order
        </button>
      </Link>

      <div style={{ marginTop: 30 }}>
        <Link href="/">← Continue Shopping</Link>
      </div>
    </div>
  );
}
