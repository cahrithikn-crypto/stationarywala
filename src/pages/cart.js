import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Remove item
  function removeItem(index) {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
                marginBottom: 10,
                borderRadius: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <div>₹{item.price}</div>
              </div>

              <button
                onClick={() => removeItem(index)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
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
