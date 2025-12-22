import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  function addToCart(p) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((i) => i._id === p._id);
    found ? (found.qty += 1) : cart.push({ ...p, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  let filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => category === "All" || p.category === category);

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#e53935", color: "#fff", padding: 15 }}>
        <h1>Stationarywala</h1>
        <Link href="/cart"><button>🛒 Cart</button></Link>
      </div>

      <input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

      <select onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Price Low → High</option>
        <option value="high">Price High → Low</option>
      </select>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,200px)", gap: 20 }}>
        {filtered.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: 10 }}>
            {p.image && <img src={p.image} width={150} />}
            <h4>{p.name}</h4>
            ₹{p.price}
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
