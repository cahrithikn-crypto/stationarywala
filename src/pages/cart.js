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
    <div style={{ padding: 30 }}>
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
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

          <h2>Total: ₹{total}</h2>

          {/* Proceed to Checkout */}
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
