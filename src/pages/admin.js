import { useEffect, useState } from "react";

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  async function login(e) {
    e.preventDefault();
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.success) {
      setAuthorized(true);
      localStorage.setItem(
  "admin_auth",
  JSON.stringify({
    loggedIn: true,
    expires: Date.now() + 30 * 60 * 1000 // 30 minutes
  })
);
;
    } else {
      setError("Wrong password");
    }
  }

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function addProduct(e) {
    e.preventDefault();
    await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-auth": process.env.NEXT_PUBLIC_ADMIN_KEY
  },
  body: JSON.stringify({ name, price: Number(price), stock: Number(stock) })
});

    });
    setName("");
    setPrice("");
    setStock("");
    fetchProducts();
  }

  async function deleteProduct(id) {
   await fetch("/api/products?id=" + id, {
  method: "DELETE",
  headers: {
    "x-admin-auth": process.env.NEXT_PUBLIC_ADMIN_KEY
  }
});

  useEffect(() => {
   const session = JSON.parse(localStorage.getItem("admin_auth"));
if (session && session.loggedIn && session.expires > Date.now()) {
  setAuthorized(true);
  fetchProducts();
} else {
  localStorage.removeItem("admin_auth");
}

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
        <button type="submit">Add Product</button>
      </form>

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: 10 }}>
          {p.name} – ₹{p.price} – Stock: {p.stock}
          <button onClick={() => deleteProduct(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function logout() {
  localStorage.removeItem("admin_auth");
  setAuthorized(false);
}


