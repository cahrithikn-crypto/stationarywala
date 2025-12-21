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

      <h2>Add Product</h2>
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
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <input
          placeholder="Image URL (https://...)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        <button type="submit">Add Product</button>
      </form>

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ display: "flex", marginBottom: 10 }}>
          <img
            src={p.image}
            alt={p.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              marginRight: 10,
              borderRadius: 6,
            }}
          />
          <div>
            <strong>{p.name}</strong> – ₹{p.price} – Stock {p.stock}
            <br />
            <button onClick={() => deleteProduct(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
