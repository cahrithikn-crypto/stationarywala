async function placeOrder() {
  if (!form.name || !form.phone || !form.address) {
    alert("Please fill all details");
    return;
  }

  const orderData = {
    customer: form,
    items: cart,
    total,
    paymentMethod,
    status: paymentMethod === "COD" ? "Pending" : "Paid",
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();

  localStorage.removeItem("cart");

  // 👉 REDIRECT WITH ORDER ID
  router.push(`/success?orderId=${data.orderId}`);
}
