import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../components/Header";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  if (!orderId) return null;

  return (
    <>
      <Header />

      <div style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ color: "#2e7d32" }}>✅ Order Placed Successfully!</h1>

        <p>
          <b>Order ID:</b> {orderId}
        </p>

        <p>
          You can track your order anytime using the link below.
        </p>

        <Link href={`/track/${orderId}`}>
          <button
            style={{
              padding: "12px 20px",
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
    </>
  );
}
