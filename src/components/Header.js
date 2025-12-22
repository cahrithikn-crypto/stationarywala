import Link from "next/link";
import Header from "../components/Header";

export default function Success() {
  return (
    <>
      <Header showCategories={false} showCart={false} />

      <div
        style={{
          padding: 40,
          maxWidth: 600,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#2e7d32" }}>✅ Order Placed Successfully</h1>

        <p style={{ marginTop: 20, fontSize: 16 }}>
          Thank you for shopping with <b>Stationarywala</b>.
        </p>

        <p style={{ marginTop: 10, color: "#555" }}>
          You can track your order using the tracking link provided.
        </p>

        <Link href="/">
          <button
            style={{
              marginTop: 30,
              padding: "12px 24px",
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    </>
  );
}
