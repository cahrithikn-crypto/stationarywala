import { useEffect, useState } from "react";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  function updateCart(updatedCart) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function increaseQty(id) {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  }

  function decreaseQty(id) {
    const updated = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updated);
  }

  function removeItem(id) {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 30 }}>
      {/* HEADER */}
      <header
        style={{
          background: "#e53935",
          color: "#fff",
          padding: "14px 20px",
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>🛒 Your Cart</h2>
        <Link href="/" style={{ color: "#fff" }}>
          ⬅ Back to Shop
        </Link>
      </header>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <h2>Your cart is empty 😔</h2>
          <Link href="/">
            <button
              style={{
                marginTop: 20,
                background: "#e53935",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Shop Now
            </button>
          </Link>
        </div>
      )}

      {/* CART ITEMS */}
      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => decreaseQty(item._id)}>-</button>
            <strong>{item.quantity}</strong>
            <button onClick={() => increaseQty(item._id)}>+</button>
          </div>

          <div>
            <p>
              <strong>₹{item.price * item.quantity}</strong>
            </p>
            <button
              onClick={() => removeItem(item._id)}
              style={{
                background: "transparent",
                color: "#e53935",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL */}
      {cart.length > 0 && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            textAlign: "right",
          }}
        >
          <h2>Total: ₹{total}</h2>

          <button
            style={{
              marginTop: 10,
              background: "#e53935",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={() => alert("Checkout coming next 🚀")}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
