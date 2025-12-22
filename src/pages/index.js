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
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
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
    setCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
    alert("Added to cart");
  }

  // --------------------
  // Load on page open
  // --------------------
  useEffect(() => {
    fetchProducts();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
  }, []);

  // --------------------
  // Filters
  // --------------------
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: 20 }}>
      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "#e53935",
          color: "#fff",
          padding: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 6,
        }}
      >
        <h1>📘 Stationarywala</h1>

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
              position: "relative",
            }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#ff1744",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: 12,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* ================= SEARCH ================= */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Search stationery items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* ================= CATEGORY FILTER ================= */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 12px",
              borderRadius: 20,
              border:
                selectedCategory === cat
                  ? "2px solid #e53935"
                  : "1px solid #ccc",
              background:
                selectedCategory === cat ? "#e53935" : "#fff",
              color:
                selectedCategory === cat ? "#fff" : "#000", // ✅ BLACK TEXT
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= BANNER ================= */}
      <div
        style={{
          background: "#fbe9e7",
          padding: 20,
          borderRadius: 6,
          marginTop: 25,
        }}
      >
        <h2>Everything you need for School & Office ✏️</h2>
        <p>Notebooks, pens, files & more — at best prices</p>
      </div>

      {/* ================= PRODUCTS ================= */}
      <h2 style={{ marginTop: 30 }}>Products</h2>

      {filteredProducts.length === 0 && <p>No products found</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 20,
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
            <div
              style={{
                height: 140,
                background: "#f5f5f5",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: 12,
              }}
            >
              Image coming soon
            </div>

            <h3>{p.name}</h3>
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <p style={{ fontSize: 12, color: "#555" }}>
              Category: <b>{p.category}</b>
            </p>
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
                borderRadius: 4,
                cursor: "pointer",
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
  );
}
