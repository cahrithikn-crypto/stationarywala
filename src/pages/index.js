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
  const [search, setSearch] = useState("");

  // --------------------
  // Fetch products
  // --------------------
  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  // --------------------
  // Add to cart (unchanged)
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
  // Filters
  // --------------------
  const filteredProducts = products
    .filter(
      (p) =>
        selectedCategory === "All" || p.category === selectedCategory
    )
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      {/* ================= HEADER (Amazon-style red) ================= */}
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
        <h2 style={{ margin: 0 }}>Stationarywala</h2>

        <Link href="/cart">
          <button
            style={{
              background: "#fff",
              color: "#e53935",
              border: "none",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: 4,
              fontWeight: "bold",
            }}
          >
            🛒 Go to Cart
          </button>
        </Link>
      </div>

      {/* ================= SEARCH ================= */}
      <div style={{ padding: 20 }}>
        <input
          placeholder="Search stationery products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      </div>

      {/* ================= CATEGORIES (KEPT & VISIBLE) ================= */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "0 20px 20px",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 14px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background:
                selectedCategory === cat ? "#000" : "#fff",
              color:
                selectedCategory === cat ? "#fff" : "#000",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          padding: 20,
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 12,
              background: "#fff",
            }}
          >
            {/* PRODUCT IMAGE (RESTORED) */}
            <div
              style={{
                height: 160,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
              }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : (
                <span style={{ fontSize: 12, color: "#777" }}>
                  No image
                </span>
              )}
            </div>

            <h4 style={{ margin: "5px 0" }}>{p.name}</h4>
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <p style={{ fontSize: 12 }}>Stock: {p.stock}</p>

            <button
              onClick={() => addToCart(p)}
              style={{
                width: "100%",
                marginTop: 8,
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
          textAlign: "center",
          padding: 20,
          borderTop: "1px solid #ddd",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} Stationarywala
      </div>
    </div>
  );
}
