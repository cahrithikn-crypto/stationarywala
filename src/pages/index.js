import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Stationarywala</h1>

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
              padding: 12,
              borderRadius: 8,
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 6,
                marginBottom: 10,
              }}
            />

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
