import Header from "../components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  // --------------------
  // Fetch products
  // --------------------
  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  // --------------------
  // Add to cart
  // --------------------
  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* ✅ HEADER AT TOP */}
      <Header />

      <div style={{ padding: 20 }}>
        {/* ================= BANNER ================= */}
        <div
          style={{
            background: "#fbe9e7",
            padding: 20,
            borderRadius: 6,
            marginBottom: 30,
          }}
        >
          <h2>Everything you need for School & Office ✏️</h2>
          <p>Notebooks, pens, files & more — at best prices</p>
        </div>

        {/* ================= PRODUCTS ================= */}
        <h2 style={{ marginBottom: 15 }}>Popular Products</h2>

        {products.length === 0 && <p>No products available</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 6,
                background: "#fff",
              }}
            >
              <div
                style={{
                  height: 140,
                  background: "#f5f5f5",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "#777",
                }}
              >
                Image coming soon
              </div>

              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
              <p style={{ fontSize: 12 }}>Stock: {p.stock}</p>

              <button
                onClick={() => addToCart(p)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "8px 0",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <div
          style={{
            marginTop: 50,
            paddingTop: 20,
            borderTop: "1px solid #ddd",
            textAlign: "center",
            color: "#666",
          }}
        >
          © {new Date().getFullYear()} Stationarywala. All rights reserved.
        </div>
      </div>
    </>
  );
}
