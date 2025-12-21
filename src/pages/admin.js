import { useState, useEffect } from "react";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  /* ---------------- LOGIN ---------------- */

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
    setProducts(await res.json());
  }

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  }

  /* ---------------- PRODUCTS ---------------- */

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

  /* ---------------- ORDER UPDATE ---------------- */

  async function updateOrder(id, data) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    fetchOrders();
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

  /* ---------------- LOGIN PAGE ---------------- */

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

  /* ---------------- ADMIN PANEL ---------------- */

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin – Stationarywala</h1>
      <button onClick={logout}>Logout</button>

      {/* ADD PRODUCT */}
      <h2 style={{ marginTop: 30 }}>Add Product</h2>
      <form onSubmit={addProduct}>
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
          value={
