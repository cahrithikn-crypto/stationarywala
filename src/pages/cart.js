import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart and normalize quantity
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    const normalized = saved.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(normalized);
    localStorage.setItem("cart", JSON.stringify(normalized));
  }, []);

  function updateCart(updated) {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function increase(index) {
    const updated = [...cart];
    updated[index].quantity += 1;
    updateCart(updated);
  }

  function decrease(index) {
    const updated = [...cart];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updateCart(updated);
    }
  }

  function removeItem(index) {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginBottom: 12,
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <div>₹{item.price}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => decrease(index)}>➖</button>
                <strong>{item.quantity}</strong>
                <button onClick={() => increase(index)}>➕</button>
              </div>

              <div>
                ₹{item.price * item.quantity}
              </div>

              <button
                onClick={() => removeItem(index)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <button
            style={{
              background: "#1a73e8",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 6,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
