import { useState, useEffect } from "react";

const CATEGORIES = [
  "Writing Instruments",
  "Paper & Notebooks",
  "Files & Folders",
  "Geometry & Measuring",
  "School Essentials",
  "Art & Craft",
  "Office Supplies",
  "Printing & Accessories",
  "Gift & Fancy Stationery",
];

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  async function login(e) {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem(
        "admin_auth",
        JSON.stringify({
          loggedIn: true,
          expires: Date.now() + 30 * 60 * 1000,
        })
      );
      setAuthorized(true);
      fetchProducts();
    } else {
      setError("Wrong password");
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    setAuthorized(false);
  }

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function addProduct(e) {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock),
        category,
      }),
    });

    setName("");
    setPrice("");
    setStock("");
    setCategory(CATEGORIES[0]);

    fetchProducts();
  }

  async function deleteProduct(id) {
    await fetch("/api/products?id=" + id, { method: "DELETE" });
    fetchProducts();
  }

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("admin_auth"));

    if (session && session.loggedIn && session.expires > Date.now()) {
      setAuthorized(true);
      fetchProducts();
    } else {
      localStorage.removeItem("admin_auth");
    }
  }, []);

  if (!authorized) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Admin Login</h1>
        <form onSubmit={login}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin – Stationarywala</h1>
      <button onClick={logout}>Logout</button>

      {/* ================= ADD PRODUCT ================= */}
      <h2 style={{ marginTop: 30 }}>Add Product</h2>

      <form onSubmit={addProduct} style={{ maxWidth: 400 }}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        {/* ✅ CATEGORY DROPDOWN */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button type="submit">Add Product</button>
      </form>

      {/* ================= PRODUCT LIST ================= */}
      <h2 style={{ marginTop: 40 }}>Products</h2>

      {products.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <strong>{p.name}</strong> – ₹{p.price}  
          <div style={{ fontSize: 12 }}>
            Category: <b>{p.category || "N/A"}</b> | Stock: {p.stock}
          </div>

          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
