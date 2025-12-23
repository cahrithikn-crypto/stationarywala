import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
const [products, setProducts] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("All");

// --------------------
// Categories
// --------------------
const categories = [
"All",
"Notebooks",
"Pens & Writing",
"Art & Craft",
"Office Supplies",
"School Supplies",
"Files & Folders",
"Calculators",
];

// --------------------
// Fetch products
// --------------------
async function fetchProducts() {
const res = await fetch("/api/products");
const data = await res.json();
setProducts(data);
}

// --------------------
// Add to cart
// --------------------
function addToCart(product) {
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const existing = cart.find((item) => item._id === product._id);

if (existing) {
existing.qty += 1;
} else {
cart.push({ ...product, qty: 1 });
}

localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to cart");
}

// --------------------
// Load on page open
// --------------------
useEffect(() => {
fetchProducts();
}, []);

// --------------------
// Filter products
// --------------------
const filteredProducts =
selectedCategory === "All"
? products
: products.filter(
(p) =>
p.category &&
p.category.toLowerCase() === selectedCategory.toLowerCase()
);

return (
<>
{/* ===== HEADER ===== */}
<Header />

<div style={{ padding: 20, maxWidth: 1300, margin: "auto" }}>
{/* ===== HERO / BANNER ===== */}
<div
style={{
background: "#fbe9e7",
padding: 25,
borderRadius: 6,
marginBottom: 30,
}}
>
<h1 style={{ marginBottom: 10 }}>
Everything for School & Office 📚
</h1>
<p style={{ color: "#555" }}>
Pens, notebooks, files & more — delivered to your doorstep
</p>

          
</div>



{/* ===== PRODUCTS ===== */}
<h2 style={{ marginBottom: 15 }}>
{selectedCategory === "All"
? "Popular Products"
: selectedCategory}
</h2>

{filteredProducts.length === 0 && (
<p>No products available</p>
)}

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
gap: 20,
}}
>
{filteredProducts.map((p) => (
<div
key={p._id}
style={{
border: "1px solid #ddd",
padding: 15,
borderRadius: 6,
background: "#fff",
}}
>
{/* IMAGE PLACEHOLDER */}
<div
style={{
height: 140,
background: "#f5f5f5",
marginBottom: 10,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 12,
color: "#777",
}}
>
Product Image
</div>

<h3 style={{ margin: "5px 0" }}>{p.name}</h3>
<p style={{ fontWeight: "bold", margin: "5px 0" }}>
₹{p.price}
</p>

<p style={{ fontSize: 12, color: "#555" }}>
Stock: {p.stock}
</p>

<button
onClick={() => addToCart(p)}
style={{
marginTop: 10,
width: "100%",
padding: "8px 0",
background: "#1976d2",
color: "#fff",
border: "none",
cursor: "pointer",
borderRadius: 4,
}}
>
Add to Cart
</button>
</div>
))}
</div>

{/* ===== FOOTER ===== */}
<div
style={{
marginTop: 60,
paddingTop: 20,
borderTop: "1px solid #ddd",
textAlign: "center",
color: "#666",
fontSize: 14,
}}
>
© {new Date().getFullYear()} Stationarywala — All rights reserved
</div>
</div>
</>
);
}


