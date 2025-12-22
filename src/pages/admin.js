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
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");

  // ---------------- LOGIN ----------------
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
      fetchOrders();
    } else setError("Wrong password");
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    setAuthorized(false);
  }

  // ---------------- PRODUCTS ----------------
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
        image,
      }),
    });
    setName("");
    setPrice("");
    setStock("");
    setImage("");
    fetchProducts();
  }

  async function deleteProduct(id) {
    await fetch("/api/products?id=" + id, { method: "DELETE" });
    fetchProducts();
  }

  // ---------------- ORDERS ----------------
  async function fetchOrders() {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  }

  async function updateOrder(id, data) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    fetchOrders();
  }

  // ---------------- SESSION CHECK ----------------
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("admin_auth"));
    if (session && session.loggedIn && session.expires > Date.now()) {
      setAuthorized(true);
      fetchProducts();
      fetchOrders();
    } else localStorage.removeItem("admin_auth");
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
          <button>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  const totalStock = products.reduce((a, b) => a + b.stock, 0);
  const inventoryValue = products.reduce(
    (a, b) => a + b.price * b.stock,
    0
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin – Stationarywala</h1>
      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: 20 }}>
        <b>Total Products:</b> {products.length} <br />
        <b>Total Stock:</b> {totalStock} <br />
        <b>Inventory Value:</b> ₹{inventoryValue}
      </div>

      {/* ADD PRODUCT */}
      <h2>Add Product</h2>
      <form onSubmit={addProduct} style={{ maxWidth: 400 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button>Add Product</button>
      </form>

      {/* PRODUCTS */}
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ddd", padding: 10 }}>
          <b>{p.name}</b> – ₹{p.price} – {p.category}
          <br />
          {p.image && <img src={p.image} width={80} />}
          <br />
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}

      {/* ORDERS */}
      <h2 style={{ marginTop: 40 }}>Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
          <div><b>Date:</b> {new Date(o.createdAt).toLocaleString()}</div>
          <div><b>Total:</b> ₹{o.total}</div>
          <div><b>Payment:</b> {o.paymentMethod}</div>

          <div style={{ marginTop: 8 }}>
            <b>Status:</b>{" "}
            <select
              value={o.status || "Pending"}
              onChange={(e) =>
                updateOrder(o._id, { status: e.target.value })
              }
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <b>Tracking:</b>{" "}
            <input
              defaultValue={o.trackingNumber || ""}
              placeholder="Tracking number"
              onBlur={(e) =>
                updateOrder(o._id, { trackingNumber: e.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
