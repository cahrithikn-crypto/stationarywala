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

  // Place order
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

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Order failed. Try again.");
      return;
    }

    localStorage.removeItem("cart");

    // 👉 Redirect with Order ID
    router.push(`/success?orderId=${data.orderId}`);
  }

  return (
    <>
      <Header showCategories={false} showCart={false} />

      <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
        <h1>Checkout</h1>

        {/* Order Summary */}
        <div style={boxStyle}>
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div key={item._id} style={rowStyle}>
              <div>
                {item.name} × {item.qty}
              </div>
              <div>₹{item.price * item.qty}</div>
            </div>
          ))}

          <hr />
          <h3>Total: ₹{total}</h3>
        </div>

        {/* Delivery Details */}
        <div style={boxStyle}>
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

        {/* Payment */}
        <div style={boxStyle}>
          <h2>Payment Method</h2>

          <label style={radioStyle}>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label style={radioStyle}>
            <input
              type="radio"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            UPI (Coming Soon)
          </label>
        </div>

        {/* Place Order */}
        <button style={orderBtn} onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const boxStyle = {
  border: "1px solid #ddd",
  padding: 20,
  borderRadius: 6,
  marginBottom: 30,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
};

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
};

const orderBtn = {
  width: "100%",
  padding: 14,
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  fontSize: 16,
  cursor: "pointer",
  borderRadius: 4,
};

