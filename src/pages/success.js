import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../components/Header";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <>
      <Header />

      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>🎉 Order Placed Successfully!</h1>

        {orderId && (
          <>
            <p>Your Order ID:</p>
            <h2 style={{ color: "#d32f2f" }}>{orderId}</h2>

            <Link href={`/track/${orderId}`}>
              <button style={btnStyle}>Track Your Order</button>
            </Link>
          </>
        )}

        <br /><br />

        <Link href="/">
          <button style={secondaryBtn}>Continue Shopping</button>
        </Link>
      </div>
    </>
  );
}

const btnStyle = {
  padding: "12px 24px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  borderRadius: 4,
};

const secondaryBtn = {
  padding: "10px 20px",
  background: "#555",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
};
