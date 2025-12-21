import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    updateCartCount();
  }, []);

  // Update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }

  // Add to cart
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
  }

  // Pick popular products (first 4)
  const popularProducts = products.slice(0, 4);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header
        style={{
          background: "#e53935",
          color: "#fff",
          padding: "14px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>📚 Stationerywala</h2>

        <nav style={{ display: "flex", gap: 20 }}>
          <Link href="/" style={{ color: "#fff" }}>Home</Link>
          <Link href="/cart" style={{ color: "#fff" }}>
            Cart ({cartCount})
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section
        style={{
          background: "#fff3f3",
          padding: "50px 30px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>
          Everything You Need for School & Office ✏️
        </h1>
        <p style={{ fontSize: 18, color: "#555" }}>
          Best quality stationery at unbeatable prices
        </p>

        <Link href="#products">
          <button
            style={{
              marginTop: 20,
              background: "#e53935",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Shop Now
          </button>
        </Link>
      </section>

      {/* ================= POPULAR PRODUCTS ================= */}
      <section style={{ padding: "40px 30px" }}>
        <h2 style={{ marginBottom: 20 }}>🔥 Popular Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {popularProducts.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
              <button
                onClick={() => addToCart(p)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ALL PRODUCTS ================= */}
      <section id="products" style={{ padding: "40px 30px" }}>
        <h2 style={{ marginBottom: 20 }}>📦 All Products</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
              <p style={{ color: "#777" }}>Stock: {p.stock}</p>

              <button
                onClick={() => addToCart(p)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "#111",
          color: "#ccc",
          padding: "30px",
          marginTop: 40,
          textAlign: "center",
        }}
      >
        <p>© {new Date().getFullYear()} Stationerywala</p>
        <p>Made with ❤️ in India</p>
      </footer>
    </div>
  );
}
