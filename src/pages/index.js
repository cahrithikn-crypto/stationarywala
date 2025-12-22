import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Writing Instruments",
  "Paper & Notebooks",
  "Files & Folders",
  "Geometry & Measuring",
  "School Essentials",
  "Art & Craft",
  "Office Supplies",
  "Printing & Accessories",
  "Gift & Fancy Stationery",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // --------------------
  // Filter products
  // --------------------
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* ================= RED AMAZON STYLE HEADER ================= */}
      <div
        style={{
          background: "#e53935",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>📘 Stationarywala</h2>

        <Link href="/cart">
          <button
            style={{
              background: "#fff",
              color: "#e53935",
              border: "none",
              padding: "8px 14px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🛒 Go to Cart
          </button>
        </Link>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 10,
          padding: "10px 15px",
          background: "#fff",
          borderBottom: "1px solid #ddd",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              whiteSpace: "nowrap",
              padding: "6px 12px",
              borderRadius: 20,
              border:
                selectedCategory === cat
                  ? "2px solid #e53935"
                  : "1px solid #ccc",
              background:
                selectedCategory === cat ? "#fdecea" : "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= BANNER ================= */}
      <div
        style={{
          background: "#fdecea",
          padding: 20,
          margin: 20,
          borderRadius: 6,
        }}
      >
        <h2>School • Office • Art • Exam Essentials ✏️</h2>
        <p>Everything you need — trusted stationery at best prices</p>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div style={{ padding: 20 }}>
        <h2 style={{ marginBottom: 15 }}>
          {selectedCategory === "All"
            ? "Popular Products"
            : selectedCategory}
        </h2>

        {filteredProducts.length === 0 && (
          <p>No products available in this category</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                borderRadius: 6,
                background: "#fff",
              }}
            >
              {/* IMAGE PLACEHOLDER */}
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
                Product Image
              </div>

              <h3 style={{ margin: "6px 0" }}>{p.name}</h3>
              <p style={{ fontWeight: "bold", margin: "4px 0" }}>
                ₹{p.price}
              </p>

              <p style={{ fontSize: 12, color: "#555" }}>
                Category: {p.category || "General"}
              </p>

              <p style={{ fontSize: 12, color: "#555" }}>
                Stock: {p.stock}
              </p>

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
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          marginTop: 50,
          padding: 20,
          textAlign: "center",
          borderTop: "1px solid #ddd",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} Stationarywala — All rights reserved
      </div>
    </div>
  );
}
