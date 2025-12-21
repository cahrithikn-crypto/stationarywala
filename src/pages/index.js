import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <h1>Stationarywala</h1>
        <button className="cart-btn">🛒 Cart</button>
      </header>

      {/* HERO */}
      <section className="hero">
        <h2>All Your Stationery Needs, One Place ✏️📚</h2>
        <p>Affordable • Quality • Fast Delivery</p>
        <button className="hero-btn">Shop Now</button>
      </section>

      {/* PRODUCTS */}
      <main className="container">
        <h2 className="section-title">Popular Products</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="price">₹{p.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Stationarywala. All rights reserved.
      </footer>
    </>
  );
}
