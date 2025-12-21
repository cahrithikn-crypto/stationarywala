/* ===============================
   GLOBAL RESET & BASE
================================ */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  min-height: 100vh;
  color: #222;
}

/* ===============================
   COMMON LAYOUT
================================ */
.container {
  max-width: 1100px;
  margin: auto;
  padding: 30px;
}

/* ===============================
   HEADER & FOOTER
================================ */
.header {
  background: #111;
  color: #fff;
  padding: 16px 30px;
  font-size: 22px;
  font-weight: bold;
}

.footer {
  background: #111;
  color: #aaa;
  padding: 20px;
  text-align: center;
  margin-top: 60px;
  font-size: 14px;
}

/* ===============================
   BUTTONS
================================ */
button {
  background: #2c7be5;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #1a5fd0;
}

button:disabled {
  background: #999;
  cursor: not-allowed;
}

/* ===============================
   FORMS & INPUTS
================================ */
input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin: 8px 0 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2c7be5;
}

/* ===============================
   PRODUCT GRID & CARDS
================================ */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.product-card h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.product-card p {
  margin: 6px 0;
  font-weight: bold;
}

/* ===============================
   CART & CHECKOUT
================================ */
.cart-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

/* ===============================
   ADMIN PAGE
================================ */
.admin-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.admin-container h1,
.admin-container h2 {
  margin-top: 0;
}

.admin-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* ===============================
   ORDERS
================================ */
.order-card {
  background: #fff;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
}

/* ===============================
   HOME PAGE BACKGROUND (OPTIONAL)
================================ */
.home {
  min-height: 100vh;
  background: url("/images/bg.jpg") center / cover no-repeat;
}

/* ===============================
   RESPONSIVE (MOBILE)
================================ */
@media (max-width: 600px) {
  .container {
    padding: 20px;
  }

  .header {
    font-size: 18px;
    text-align: center;
  }

  button {
    width: 100%;
  }
}
