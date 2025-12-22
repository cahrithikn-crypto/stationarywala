import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header({
  showCategories = true,
  showCart = true,
}) {
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
      {/* ===== TOP RED BAR ===== */}
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
        <Link href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <h2 style={{ margin: 0 }}>Stationarywala</h2>
        </Link>

        {showCart && (
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
        )}
      </header>

      {/* ===== CATEGORY BAR (OPTIONAL) ===== */}
      {showCategories && (
        <div
          style={{
            display: "flex",
            gap: 20,
            padding: "10px 30px",
            borderBottom: "1px solid #ddd",
            background: "#fff",
            fontSize: 14,
          }}
        >
          <span>Notebooks</span>
          <span>Pens</span>
          <span>Pencils</span>
          <span>Files & Folders</span>
          <span>Art Supplies</span>
          <span>School Kits</span>
          <span>Office Supplies</span>
        </div>
      )}
    </>
  );
}
