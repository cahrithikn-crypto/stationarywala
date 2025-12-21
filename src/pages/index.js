import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Load cart from localStorage
  useEffect(() => {
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
      {/* HEADER */}
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>Stationarywala</h1>
      <p style={{ marginBottom: 30 }}>
        🛒 Cart Items: <strong>{cart.length}</strong>
      </p>

      {/* PRODUCTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              background: "#fff",
            }}
          >
            {/* IMAGE (fallback safe) */}
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "contain",
                marginBottom: 10,
              }}
            />

            <h3 style={{ marginBottom: 6 }}>{product.name}</h3>
            <p style={{ fontWeight: "bold", marginBottom: 10 }}>
              ₹{product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              style={{
                background: "#e53935",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                borderRadius: 6,
                cursor: "pointer",
                width: "100%",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
