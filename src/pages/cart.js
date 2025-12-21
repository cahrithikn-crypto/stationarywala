import { useEffect, useState } from "react";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Update localStorage
  function updateCart(updatedCart) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Increase quantity
  function increase(index) {
    const updated = [...cart];
    updated[index].qty = (updated[index].qty || 1) + 1;
    updateCart(updated);
  }

  // Decrease quantity
  function decrease(index) {
    const updated = [...cart];
    if ((updated[index].qty || 1) > 1) {
      updated[index].qty -= 1;
      updateCart(updated);
    }
  }

  // Remove item
  function removeItem(index) {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  }

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <>
          <p>Your cart is empty</p>
          <Link href="/" className="btn">
            ← Continue Shopping
          </Link>
        </>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
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
                <p>₹{item.price}</p>

                <div>
                  <button onClick={() => decrease(index)}>-</button>
                  <span style={{ margin: "0 10px" }}>
                    {item.qty || 1}
                  </span>
                  <button onClick={() => increase(index)}>+</button>
                </div>
              </div>

              <div>
                <p>
                  Subtotal: ₹{item.price * (item.qty || 1)}
                </p>
                <button
                  style={{ color: "red" }}
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <div style={{ marginTop: 20 }}>
            <button disabled style={{ marginRight: 10 }}>
              Place Order (Coming Soon)
            </button>

            <Link href="/" className="btn">
              ← Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
