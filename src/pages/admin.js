import { useEffect, useState } from "react";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  /* ---------------- AUTH ---------------- */

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
          expires: Date.now() + 30 * 60 * 1000, // 30 min
        })
      );
      setAuthorized(true);
      fetchProducts();
      fetchOrders();
    } else {
      setError("Wrong password");
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    setAuthorized(false);
  }

  /* ---------------- DATA FETCH ---------------- */

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  }

  /* ---------------- PRODUCT ACTIONS ---------------- */

  async function addProduct(e) {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock),
      }),
    });

    setName("");
    setPrice("");
    setStock("");
    fetchProducts();
  }

  async function deleteProduct(id) {
    await fetch("/api/products?id=" + id, { method: "DELETE" });
    fetchProducts();
  }

  /* ---------------- SESSION CHECK ---------------- */

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("admin_auth"));

    if (session && session.loggedIn && session.expires > Date.now()) {
      setAuthorized(true);
      fetchProducts();
      fetchOrders();
    } else {
      localStorage.removeItem("admin_auth");
    }
  }, []);

  /* ---------------- LOGIN UI ---------------- */

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

  /* ---------------- ADMIN DASHBOARD ---------------- */

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Admin – Stationarywala</h1>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      {/* ADD PRODUCT */}
      <h2>Add Product</h2>
      <form onSubmit={addProduct} style={{ marginBottom: 30 }}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {/* PRODUCTS */}
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: 10 }}>
          {p.name} – ₹{p.price} – Stock: {p.stock}
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}

      {/* ORDERS */}
      <h2 style={{ marginTop: 40 }}>Orders</h2>

      {orders.length === 0
