document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category-filter");
    const searchBox = document.getElementById("searchBox");

    // Function to fetch products based on filters
    function fetchProducts(subcategory = "all", search = "") {
        const url = new URL("grocery_website/get_products.php", window.location.origin);
        if (subcategory !== "all") url.searchParams.set("subcategory", subcategory);
        if (search.trim() !== "") url.searchParams.set("search", search);

        fetch(url)
            .then((response) => response.json())
            .then((products) => {
                productList.innerHTML = "";

                if (products.length === 0) {
                    productList.innerHTML = "<p>No products found.</p>";
                } else {
                    products.forEach((product) => {
                        const productCard = document.createElement("div");
                        productCard.className = "product-card";

                        productCard.innerHTML = `
                            <img src="${product.imageURL}" alt="${product.productName}">
                            <h3>${product.productName}</h3>
                            <p>${product.description}</p>
                            <p><strong>$${parseFloat(product.price).toFixed(2)}</strong></p>
                            <p>Stock: ${product.stock}</p>
                            <button class="add-to-cart-btn" data-product='${JSON.stringify(product)}'>Add to Cart</button>`;

                        productList.appendChild(productCard);

                        const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
                        addToCartBtn.addEventListener("click", () => {
                            const productData = JSON.parse(addToCartBtn.getAttribute("data-product"));
                            addToCart(productData.productID);
                        });
                    });
                }
            })
            .catch((error) => {
                console.error("Error loading products:", error);
                productList.innerHTML = "<p>Failed to load products. Error: " + error.message + "</p>";
            });
    }
    function addToCart(productId) {
        const userID = sessionStorage.getItem("userID");

        if (!userID) {
            alert("You must be logged in to add items to your cart.");
            return;
        }

        const cartKey = `cart_${userID}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existing = cart.find((item) => item.productID === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ productID: productId, quantity: 1 });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert("Product added to cart!");
    }
    // Read URL parameters to set default filters
    const urlParams = new URLSearchParams(window.location.search);
    const initialSubcategory = urlParams.get("subcategory") || "all";
    const initialSearch = urlParams.get("search") || "";

    // Set dropdown and search box values if they exist
    if (categoryFilter) categoryFilter.value = initialSubcategory;
    if (searchBox) searchBox.value = initialSearch;

    // Initial fetch
    fetchProducts(initialSubcategory, initialSearch);

    // Filter when dropdown changes
    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            const selected = categoryFilter.value;
            const search = searchBox ? searchBox.value : "";
            fetchProducts(selected, search);
        });
    }

    // Trigger search on Enter key
    if (searchBox) {
        searchBox.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const search = searchBox.value;
                const subcategory = categoryFilter ? categoryFilter.value : "all";
                fetchProducts(subcategory, search);
                history.replaceState(null, "", `?subcategory=${subcategory}&search=${encodeURIComponent(search)}`);
            }
        });
    }
});
