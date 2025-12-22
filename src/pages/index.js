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
  const [cartCount, setCartCount] = useState(0);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i._id === product._id);

    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
    alert("Added to cart");
  }

  useEffect(() => {
    fetchProducts();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((s, i) => s + i.qty, 0));
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
            }}
          >
            🛒 Cart ({cartCount})
          </button>
        </Link>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: 20,
          marginTop: 30,
        }}
      >
        {/* ========== SIDEBAR ========== */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 15,
            background: "#fff",
            height: "fit-content",
          }}
        >
          <h3 style={{ marginBottom: 15 }}>Categories</h3>

          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 10px",
                marginBottom: 6,
                cursor: "pointer",
                borderRadius: 4,
                background:
                  selectedCategory === cat ? "#e53935" : "#f5f5f5",
                color: selectedCategory === cat ? "#fff" : "#000",
                fontWeight: selectedCategory === cat ? "bold" : "normal",
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* ========== PRODUCTS ========== */}
        <div>
          <h2 style={{ marginBottom: 15 }}>
            {selectedCategory === "All"
              ? "All Products"
              : selectedCategory}
          </h2>

          {filteredProducts.length === 0 && (
            <p>No products found</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
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
                <div
                  style={{
                    height: 140,
                    background: "#f5f5f5",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                    padding: 8,
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
        </div>
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
        © {new Date().getFullYear()} Stationarywala
      </div>
    </div>
  );
}
