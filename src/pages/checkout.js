import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      router.push("/");
    } else {
      setCart(storedCart);
    }
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  async function placeOrderCOD(e) {
    e.preventDefault();

    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);

    const orderData = {
      items: cart,
      total: totalAmount,
      paymentMethod: "COD",
      status: "Pending",
      customer: {
        name,
        phone,
        address,
        city,
        pincode,
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Order failed");
      }

      localStorage.removeItem("cart");
      alert("Order placed successfully (Cash on Delivery)");
      router.push("/");
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>Checkout</h1>

      {/* ORDER SUMMARY */}
      <h2>Order Summary</h2>
      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>
            {item.name} × {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr />
      <h3>Total: ₹{totalAmount}</h3>

      {/* CUSTOMER DETAILS */}
      <h2 style={{ marginTop: 30 }}>Delivery Details</h2>

      <form onSubmit={placeOrderCOD}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{ ...inputStyle, height: 80 }}
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          required
          style={inputStyle}
        />

        {/* PAYMENT METHOD */}
        <h2 style={{ marginTop: 30 }}>Payment Method</h2>
        <div style={{ marginBottom: 20 }}>
          <strong>Cash on Delivery (COD)</strong>
          <p>Pay when your order is delivered</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "#e53935",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Placing Order..." : "Place Order (COD)"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  border: "1px solid #ccc",
};
