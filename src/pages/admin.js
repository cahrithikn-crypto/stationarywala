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
  const [image, setImage] = useState("");

  /* ================= LOGIN ================= */
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
          expires: Date.now() + 30 * 60 * 1000, // 30 mins
        })
      );
      setAuthorized(true);
    } else {
      setError("Wrong password");
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    setAuthorized(false);
  }

  /* ================= DATA ================= */
  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
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
        image: image ? `/products/${image}` : "/products/default.png",
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

  async function updateOrder(data) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchOrders();
  }

  /* ================= SESSION CHECK ================= */
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

  /* ================= LOGIN UI ================= */
  if (!authorized) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
        <h1>Admin Login</h1>
        <form onSubmit={login}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <button style={{ width: "100%", padding: 10 }}>Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
  }

  /* ================= ADMIN PANEL ================= */
  return (
    <div style={{ padding: 30 }}>
      <h1>Admin – Stationarywala</h1>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      {/* ADD PRODUCT */}
      <h2>Add Product</h2>
      <form onSubmit={addProduct} style={{ maxWidth: 400 }}>
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
        <input
          placeholder="Image filename (pen.jpg)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>

      {/* PRODUCTS */}
      <h2 style={{ marginTop: 30 }}>Products</h2>
      {products.map((p) => (
        <div
          key={p._id}
          style={{
            display: "flex",
            gap: 15,
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <img
            src={p.image}
            alt={p.name}
            style={{ width: 80, height: 80, objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <strong>{p.name}</strong>
            <div>₹{p.price}</div>
            <div>Stock: {p.stock}</div>
          </div>
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}

      {/* ORDERS */}
      <h2 style={{ marginTop: 40 }}>Orders</h2>
      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
          }}
        >
          <div>Date: {new Date(o.createdAt).toLocaleString()}</div>
          <div>Total: ₹{o.total}</div>
          <div>Payment ID: {o.paymentId || "N/A"}</div>

          <div style={{ marginTop: 10 }}>
            <strong>Status:</strong>{" "}
            <select
              value={o.status || "Paid"}
              onChange={(e) =>
                updateOrder({ id: o._id, status: e.target.value })
              }
            >
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Tracking Number:</strong>{" "}
            <input
              defaultValue={o.trackingNumber || ""}
              placeholder="Enter tracking number"
              onBlur={(e) =>
                updateOrder({
                  id: o._id,
                  trackingNumber: e.target.value,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
