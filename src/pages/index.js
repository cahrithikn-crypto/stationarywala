import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // ================= FETCH PRODUCTS =================
  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  // ================= LOAD ON PAGE =================
  useEffect(() => {
    fetchProducts();

    if (typeof window !== "undefined") {
      const history =
        JSON.parse(localStorage.getItem("search_history")) || [];
      setSearchHistory(history);
    }
  }, []);

  // ================= SEARCH FILTER =================
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // ================= ADD TO CART =================
  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <>
      {/* HEADER WITH CATEGORIES */}
      <Header showCategories={true} />

      <div style={{ padding: 30, maxWidth: 1200, margin: "auto" }}>
        {/* ================= SEARCH ================= */}
        <input
          type="text"
          placeholder="Search stationery items..."
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);

            if (value.trim().length > 2) {
              let history =
                JSON.parse(localStorage.getItem("search_history")) || [];

              history = history.filter((h) => h !== value);
              history.unshift(value);
              history = history.slice(0, 5);

              localStorage.setItem(
                "search_history",
                JSON.stringify(history)
              );
              setSearchHistory(history);
            }
          }}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 16,
            border: "1px solid #bbb",
            borderRadius: 6,
            marginBottom: 10,
          }}
        />

        {/* ================= SEARCH HISTORY ================= */}
        {searchHistory.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <b>Recent Searches</b>
              <span
                style={{ color: "#d32f2f", cursor: "pointer", fontSize: 12 }}
                onClick={() => {
                  localStorage.removeItem("search_history");
                  setSearchHistory([]);
                }}
              >
                Clear
              </span>
            </div>

            {searchHistory.map((item, i) => (
              <div
                key={i}
                onClick={() => setSearchText(item)}
                style={{
                  cursor: "pointer",
                  padding: "4px 0",
                  color: "#333",
                }}
              >
                🔍 {item}
              </div>
            ))}
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        <h2>Products</h2>

        {filteredProducts.length === 0 && <p>No products found</p>}

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
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "contain",
                    marginBottom: 10,
                  }}
                />
              )}

              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <button
                onClick={() => addToCart(p)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#d32f2f",
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
    </>
  );
}
