document.addEventListener("DOMContentLoaded", () => {
    fetch("get_orders.php")
      .then((res) => res.json())
      .then((orders) => {
        renderOrders(orders);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  });
  
  function renderOrders(orders) {
    const container = document.getElementById("orders-container");
  
    if (orders.length === 0) {
      container.innerHTML = "<p>You haven't placed any orders yet.</p>";
      return;
    }
  
    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");
  
      const itemsHTML = order.items
        .map(
          (item) =>
            `<li>${item.productName} x${item.quantity} - $${(item.itemPrice * item.quantity).toFixed(2)}</li>`
        )
        .join("");
  
      orderCard.innerHTML = `
        <h3>Order #${order.orderID} — ${new Date(order.placedAt).toLocaleDateString()}</h3>
        <p>Status: <strong>${order.orderStatus}</strong></p>
        <ul>${itemsHTML}</ul>
        <p><strong>Total: $${Number(order.totalPrice).toFixed(2)}</strong></p>
      `;
  
      container.appendChild(orderCard);
    });
  }