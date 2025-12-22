import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [method, setMethod] = useState("COD");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
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

    const order = {
      customer: { name, phone, address },
      items: cart,
      total,
      paymentMethod: method,
      status: method === "COD" ? "Pending" : "Paid",
    };

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    localStorage.removeItem("cart");
    alert("Order placed successfully!");
    router.push("/");
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h1>Checkout</h1>

      {/* CUSTOMER DETAILS */}
      <h3>Delivery Details</h3>
      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />
      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={input}
      />
      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ ...input, height: 80 }}
      />

      {/* PAYMENT METHOD */}
      <h3>Payment Method</h3>

      <label style={radio}>
        <input
          type="radio"
          checked={method === "COD"}
          onChange={() => setMethod("COD")}
        />
        Cash on Delivery
      </label>

      <label style={radio}>
        <input
          type="radio"
          checked={method === "UPI"}
          onChange={() => setMethod("UPI")}
        />
        UPI (Google Pay / PhonePe / Paytm)
      </label>

      {/* UPI INFO */}
      {method === "UPI" && (
        <div
          style={{
            background: "#f5f5f5",
            padding: 15,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          <p>
            Pay via UPI to:
            <br />
            <strong>stationarywala@upi</strong>
          </p>
          <p>After payment, click Place Order</p>
        </div>
      )}

      {/* ORDER SUMMARY */}
      <h3>Order Summary</h3>
      {cart.map((item) => (
        <div key={item._id}>
          {item.name} × {item.qty} = ₹{item.price * item.qty}
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <button
        onClick={placeOrder}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#e53935",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          borderRadius: 4,
        }}
      >
        Place Order
      </button>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
};

const radio = {
  display: "block",
  marginBottom: 8,
};
