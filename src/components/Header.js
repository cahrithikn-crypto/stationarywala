import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
      {/* ===================== TOP RED BAR ===================== */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          background: "#d32f2f",
          color: "#fff",
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <h2 style={{ margin: 0 }}>Stationarywala</h2>
        </Link>

        {/* CART */}
        <Link
          href="/cart"
          style={{
            position: "relative",
            color: "#fff",
            textDecoration: "none",
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

      {/* ===================== CATEGORY BAR ===================== */}
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #ddd",
          padding: "10px 30px",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
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
        ].map((cat) => (
          <span
            key={cat}
            style={{
              cursor: "pointer",
              color: "#000",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {cat}
          </span>
        ))}
      </nav>
    </>
  );
}
