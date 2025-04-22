//
function getCurrentUserID() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser ? currentUser.userID : null;
}

function getCart() {
    const userID = sessionStorage.getItem("userID");
    if (!userID) {
        alert("You must be logged in to view your cart.");
        window.location.href = "index.html"; // Redirect to the home page
        return [];
    }

    const cartKey = `cart_${userID}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function setCart(cartItems) {
  const userID = getCurrentUserID();
  if (!userID) return;
  const cartKey = `cart_${userID}`;
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  console.log("Cart Key:", cartKey);
  console.log("Updated Cart:", cartItems);
}


document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeModal = document.querySelector(".close");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSummary = document.getElementById("checkout-summary");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  checkoutBtn?.addEventListener("click", () => {
    renderCheckoutSummary();
    checkoutModal.style.display = "block";
  });

  closeModal?.addEventListener("click", () => {
    checkoutModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      checkoutModal.style.display = "none";
    }
  });

  function renderCheckoutSummary() {
    const cart = getCart();
    fetch("get_cart_products.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIDs: cart.map((item) => parseInt(item.productID)) }),
    })
      .then((res) => res.json())
      .then((products) => {
        let html = "<ul>";
        let total = 0;

        cart.forEach((item, index) => {
          const product = products.find((p) => p.productID == item.productID);
          if (product) {
            const price = parseFloat(product.price);
            const subtotal = price * item.quantity;
            total += subtotal;

            html += `
              <li data-index="${index}">
                ${product.productName}
                <input type="number" class="qty-input" min="1" value="${item.quantity}" data-product-id="${item.productID}" style="width:50px;">
                = $<span class="item-subtotal">${subtotal.toFixed(2)}</span>
                <button class="remove-item-btn" data-product-id="${item.productID}">Remove</button>
              </li>
            `;
          }
        });

        html += `</ul><strong>Total: $<span id="checkout-total">${total.toFixed(2)}</span></strong>`;
        checkoutSummary.innerHTML = html;

        attachCartEventListeners(products);
      });
  }

  function attachCartEventListeners(products) {
    // Quantity input changes
    document.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productID = parseInt(e.target.dataset.productId);
        let cart = getCart();
        const cartItem = cart.find((item) => parseInt(item.productID) === productID);
        const newQty = parseInt(e.target.value);

        if (cartItem && newQty > 0) {
          cartItem.quantity = newQty;
          setCart(cart);
          renderCheckoutSummary(); // Refresh the view
        }
      });
    });

    // Remove buttons
    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productID = parseInt(e.target.dataset.productId);
        let cart = getCart();
        cart = cart.filter((item) => parseInt(item.productID) !== productID);
        setCart(cart);
        renderCheckoutSummary(); // Refresh the view
      });
    });
  }

  placeOrderBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const name = checkoutForm.name.value;
    const address = checkoutForm.address.value;
    const email = checkoutForm.email.value;
    const paymentMethod = checkoutForm.paymentMethod.value;

    const userID = getCurrentUserID();
    const cart = getCart();

    fetch("get_cart_products.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIDs: cart.map((item) => parseInt(item.productID)) }),
    })
        .then((res) => res.json())
        .then((products) => {
            let totalPrice = 0;
            const enrichedCart = cart.map((item) => {
                const product = products.find((p) => p.productID == item.productID);
                const price = parseFloat(product.price);
                totalPrice += price * item.quantity;
                return {
                    productID: item.productID,
                    quantity: item.quantity,
                    price: price,
                };
            });

            return fetch("place_order.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID,
                    totalPrice,
                    cartItems: enrichedCart,
                    name,
                    address,
                    email,
                    paymentMethod
                }),
            });
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Order placed successfully! Order ID: " + data.orderID);

                // Clear the cart for the current user
                const cartKey = `cart_${userID}`;
                localStorage.removeItem(cartKey);

                // Reload the page to reflect the cleared cart
                location.reload();
            } else {
                alert("Order failed: " + data.error);
            }
        })
        .catch((err) => {
            console.error("Error placing order:", err);
            alert("There was an error processing your order.");
        });
  });

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalContainer.innerHTML = "";
      return;
    }

    fetch("get_cart_products.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIDs: cart.map((item) => parseInt(item.productID)) }),
    })
      .then((res) => res.json())
      .then((products) => {
        let html = "<ul>";
        let total = 0;

        cart.forEach((item) => {
          const product = products.find((p) => p.productID == item.productID);
          if (product) {
            const price = parseFloat(product.price);
            const subtotal = price * item.quantity;
            total += subtotal;

            html += `
              <li>
                <strong>${product.productName}</strong> - $${price.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}
                <button class="remove-item-btn" data-product-id="${item.productID}">Remove</button>
              </li>
            `;
          }
        });

        html += "</ul>";
        cartItemsContainer.innerHTML = html;
        cartTotalContainer.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;

        attachCartEventListeners();
      })
      .catch((err) => {
        console.error("Error fetching cart products:", err);
        cartItemsContainer.innerHTML = "<p>There was an error loading your cart. Please try again later.</p>";
      });
  }

  function attachCartEventListeners() {
    // Remove item buttons
    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productID = parseInt(e.target.dataset.productId);
        let cart = getCart();
        cart = cart.filter((item) => parseInt(item.productID) !== productID);
        setCart(cart);
        renderCart(); // Refresh the cart view
      });
    });
  }

  // Initial render
  renderCart();
});
