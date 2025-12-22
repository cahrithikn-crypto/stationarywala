import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  async function placeOrder() {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { name, phone, address },
        items: cart,
        total,
        paymentMethod,
        status: paymentMethod === "COD" ? "Pending" : "Paid",
      }),
    });

    if (res.ok) {
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      router.push("/");
    } else {
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 30, maxWidth: 700, margin: "auto" }}>
      <h1>Checkout</h1>

      {/* CUSTOMER DETAILS */}
      <h3>Customer Details</h3>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      {/* PAYMENT METHOD */}
      <h3>Payment Method</h3>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={() => setPaymentMethod("COD")}
        />{" "}
        Cash on Delivery (COD)
      </label>

      <label style={{ display: "block", marginBottom: 20 }}>
        <input
          type="radio"
          value="UPI"
          checked={paymentMethod === "UPI"}
          onChange={() => setPaymentMethod("UPI")}
        />{" "}
        UPI (Pay & confirm manually)
      </label>

      {/* ORDER SUMMARY */}
      <h3>Order Summary</h3>

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span>
            {item.name} × {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr />
      <h2>Total: ₹{total}</h2>

      {/* PLACE ORDER */}
      <button
        onClick={placeOrder}
        disabled={loading}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "14px",
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
