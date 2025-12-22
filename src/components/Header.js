import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header({ showCategories = true }) {
  const [count, setCount] = useState(0);

  // ✅ Runs ONLY in browser
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

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <header
        style={{
          background: "#d32f2f",
          color: "#fff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <h2 style={{ margin: 0 }}>Stationarywala</h2>
        </Link>

        <Link
          href="/cart"
          style={{
            color: "#fff",
            textDecoration: "none",
            position: "relative",
            fontSize: 18,
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

      {/* ================= CATEGORIES (ONLY HOMEPAGE) ================= */}
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
