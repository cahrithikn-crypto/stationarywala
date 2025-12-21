import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Add to cart
  function addToCart(product) {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="header">
        <h1 className="logo">Stationarywala</h1>
        <Link href="/cart" className="cart-btn">
          🛒 Cart ({cart.length})
        </Link>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <h2>School & Office Stationery</h2>
        <p>Best quality stationery at affordable prices</p>
        <Link href="#products" className="hero-btn">
          Shop Now
        </Link>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section id="products" className="products-section">
        <h2>Popular Products</h2>

        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <img
                src={p.image || "https://via.placeholder.com/200"}
                alt={p.name}
              />

              <h3>{p.name}</h3>
              <p className="price">₹{p.price}</p>
              <p className="stock">
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              <button
                disabled={p.stock === 0}
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Stationarywala</p>
        <p>Contact: support@stationarywala.com</p>
      </footer>
    </div>
  );
}
