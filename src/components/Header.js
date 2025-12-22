import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header({ showCategories = true }) {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ================= CART COUNT (CLIENT ONLY) =================
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

  // ================= SEARCH HANDLER =================
  function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;

    // save search history
    const history =
      JSON.parse(localStorage.getItem("search_history")) || [];
    const updated = [search, ...history.filter((h) => h !== search)].slice(
      0,
      5
    );
    localStorage.setItem("search_history", JSON.stringify(updated));

    router.push("/?search=" + encodeURIComponent(search));
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

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          style={{ flex: 1, maxWidth: 500 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stationery items..."
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 4,
              border: "none",
              outline: "none",
            }}
          />
        </form>

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
            <span
              key={c}
              style={{ cursor: "pointer", color: "#000" }}
            >
              {c}
            </span>
          ))}
        </nav>
      )}
    </>
  );
}
