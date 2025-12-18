import { useEffect } from "react";

export default function Checkout() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const payNow = async () => {
    const amount = 500;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Stationarywala",
      description: "Stationery Purchase",
      order_id: order.id,
      handler: async function (response) {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [],
            total: amount,
            paymentId: response.razorpay_payment_id
          })
        });

        window.location.href = "/success";
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Checkout</h1>
      <p>Total Amount: ₹500</p>
      <button onClick={payNow}>Pay Now</button>
    </div>
  );
}
