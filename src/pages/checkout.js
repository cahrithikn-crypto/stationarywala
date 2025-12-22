import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Total amount
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Place order (NO real payment yet)
  async function placeOrder() {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all details");
      return;
    }

    const orderData = {
      customer: form,
      items: cart,
      total,
      paymentMethod,
      status: paymentMethod === "COD" ? "Pending" : "Paid",
    };

    async function placeOrder() {
  if (!form.name || !form.phone || !form.address) {
    alert("Please fill all details");
    return;
  }

  const orderData = {
    customer: form,
    items: cart,
    total,
    paymentMethod,
    status: paymentMethod === "COD" ? "Pending" : "Paid",
  };

  // 👉 CAPTURE RESPONSE
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  const data = await res.json(); // ✅ THIS IS POINT 2

  if (!data.success) {
    alert("Order failed. Try again.");
    return;
  }

  // ✅ Clear cart
  localStorage.removeItem("cart");

  // ✅ Redirect with orderId
  router.push(`/success?orderId=${data.orderId}`);
}


  return (
    <>
      <Header />

      <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
        <h1>Checkout</h1>

        {/* ================= CART SUMMARY ================= */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 6,
            marginBottom: 30,
          }}
        >
          <h2>Order Summary</h2>

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div>
                {item.name} × {item.qty}
              </div>
              <div>₹{item.price * item.qty}</div>
            </div>
          ))}

          <hr />
          <h3>Total: ₹{total}</h3>
        </div>

        {/* ================= DELIVERY DETAILS ================= */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 6,
            marginBottom: 30,
          }}
        >
          <h2>Delivery Details</h2>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            style={inputStyle}
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            style={{ ...inputStyle, height: 80 }}
          />
        </div>

        {/* ================= PAYMENT ================= */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 6,
            marginBottom: 30,
          }}
        >
          <h2>Payment Method</h2>

          <label style={radioStyle}>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery (COD)
          </label>

          <label style={radioStyle}>
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            UPI (Google Pay / PhonePe / Paytm)
          </label>

          {paymentMethod === "UPI" && (
            <p style={{ color: "#555", marginTop: 10 }}>
              ⚠️ UPI payment integration coming soon.  
              Order will be marked as <strong>Paid</strong> for now.
            </p>
          )}
        </div>

        {/* ================= PLACE ORDER ================= */}
        <button
          onClick={placeOrder}
          style={{
            width: "100%",
            padding: "14px",
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Place Order
        </button>
      </div>
    </>
  );
}

// ================= STYLES =================
const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const radioStyle = {
  display: "block",
  marginBottom: 10,
  cursor: "pointer",
};

