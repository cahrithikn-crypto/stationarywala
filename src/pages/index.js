import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Add to cart
  function addToCart(product) {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart`);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Stationarywala</h1>

      <p><strong>Cart:</strong> {cart.length} items</p>

      <div style={{ display: "flex", gap: 20 }}>
        {products.map(p => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              width: 200,
              borderRadius: 8,
              background: "#fff"
            }}
          >
            <img
              src={p.image || "/products/default.png"}
              alt={p.name}
              style={{ width: "100%", height: 120, objectFit: "contain" }}
            />

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            <button
              style={{
                background: "#e4002b",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: 4
              }}
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
