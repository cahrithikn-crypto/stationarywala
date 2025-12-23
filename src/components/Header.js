import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MOST_SEARCHED = [
  "Notebooks",
  "Pens",
  "School Bags",
  "Art Supplies",
  "Office Files",
  "Calculators",
];

export default function Header({ showCategories = true }) {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // ---------------- CART COUNT (CLIENT ONLY) ----------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      setCount(totalQty);
    }

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // ---------------- LOAD SEARCH HISTORY ----------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = JSON.parse(localStorage.getItem("search_history")) || [];
    setHistory(saved);
  }, []);

  // ---------------- HANDLE SEARCH ----------------
  function performSearch(text) {
    if (!text.trim()) return;

    const updated = [
      text,
      ...history.filter((h) => h !== text),
    ].slice(0, 5);

    localStorage.setItem("search_history", JSON.stringify(updated));
    setHistory(updated);
    setShowDropdown(false);

    router.push("/?search=" + encodeURIComponent(text));
  }

  function onSubmit(e) {
    e.preventDefault();
    performSearch(query);
  }

  return (
    <>
      {/* ================= TOP RED BAR ================= */}
      <header
        style={{
          background: "#d32f2f",
          color: "#fff",
          padding: "12px 30px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <h2 style={{ margin: 0 }}>Stationarywala</h2>
        </Link>

        {/* SEARCH (AMAZON STYLE) */}
        <div style={{ position: "relative", flex: 1, maxWidth: 520 }}>
          <form
  onSubmit={onSubmit}
  style={{
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 4,
    overflow: "hidden",
  }}
>
  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onFocus={() => setShowDropdown(true)}
    placeholder="Search stationery, notebooks, pens..."
    style={{
      flex: 1,
      padding: "10px 12px",
      border: "none",
      outline: "none",
      fontSize: 14,
    }}
  />
  <button
    type="submit"
    style={{
      background: "#b71c1c",
      color: "#fff",
      border: "none",
      padding: "0 16px",
      height: "100%",
      cursor: "pointer",
      fontSize: 16,
    }}
  >
    🔍
  </button>
</form>


          {/* SEARCH DROPDOWN */}
          {showDropdown && (history.length > 0 || MOST_SEARCHED.length > 0) && (
            <div
              style={{
                position: "absolute",
                top: "105%",
                left: 0,
                right: 0,
                background: "#fff",
                color: "#000",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                padding: 10,
              }}
            >
              {/* RECENT */}
              {history.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 6 }}>
                    Recent Searches
                  </div>
                  {history.map((h) => (
                    <div
                      key={h}
                      onClick={() => performSearch(h)}
                      style={{
                        padding: "6px 4px",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      🔁 {h}
                    </div>
                  ))}
                </>
              )}

              {/* MOST SEARCHED */}
              <div style={{ fontSize: 12, fontWeight: "bold", margin: "8px 0 6px" }}>
                Most Searched
              </div>
              {MOST_SEARCHED.map((m) => (
                <div
                  key={m}
                  onClick={() => performSearch(m)}
                  style={{
                    padding: "6px 4px",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  🔥 {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART */}
        <Link
          href="/cart"
          style={{
            color: "#fff",
            textDecoration: "none",
            position: "relative",
            fontSize: 18,
            whiteSpace: "nowrap",
          }}
        >
          🛒 Cart
          {count > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -12,
                background: "#fff",
                color: "#d32f2f",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {count}
            </span>
          )}
        </Link>
      </header>

      {/* ================= CATEGORIES (HOMEPAGE ONLY) ================= */}
      {showCategories && (
        <nav
          style={{
            background: "#fff",
            padding: "10px 30px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            gap: 20,
            fontWeight: 500,
          }}
        >
          {[
            "Notebooks",
            "Pens",
            "Pencils",
            "Files & Folders",
            "Art Supplies",
            "School Kits",
            "Office Supplies",
          ].map((c) => (
            <span key={c} style={{ cursor: "pointer", color: "#000" }}>
              {c}
            </span>
          ))}
        </nav>
      )}
    </>
  );
}

