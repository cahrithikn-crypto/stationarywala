import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 Stationarywala</h1>

      <h3>Products</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {products.map(product => (
          <div
            key={product._id}
            style={{ border: "1px solid #ccc", padding: 15 }}
          >
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>Cart ({cart.length})</h3>

      {cart.map((item, i) => (
        <p key={i}>{item.name} - ₹{item.price}</p>
      ))}
    </div>
  );
}
