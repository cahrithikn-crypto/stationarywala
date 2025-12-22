import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update localStorage whenever cart changes
  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  // Increase quantity
  function increaseQty(id) {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  }

  // Decrease quantity
  function decreaseQty(id) {
    const updated = cart
      .map((item) =>
        item._id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);

    updateCart(updated);
  }

  // Remove item
  function removeItem(id) {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* ================= CART ITEMS ================= */}
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 15,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <div>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Qty: {item.qty}</p>
              </div>

              <div>
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <button onClick={() => increaseQty(item._id)}>+</button>
                <button
                  onClick={() => removeItem(item._id)}
                  style={{ marginLeft: 10, color: "red" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ================= PAYMENT OPTIONS (POINT 2) ================= */}
          <div
            style={{
              marginTop: 25,
              padding: 15,
              background: "#fbe9e7",
              border: "1px solid #f44336",
              borderRadius: 6,
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Available Payment Options</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>💵 Cash on Delivery (COD)</li>
              <li>📱 UPI – Google Pay, PhonePe, Paytm</li>
            </ul>
          </div>

          {/* ================= TOTAL ================= */}
          <h2 style={{ marginTop: 25 }}>Total: ₹{total}</h2>

          {/* ================= CHECKOUT ================= */}
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <button
              onClick={() => router.push("/checkout")}
              style={{
                padding: "12px 24px",
                background: "#e53935",
                color: "#fff",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
