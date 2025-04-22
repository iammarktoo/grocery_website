function searchProducts(){
    const searchInput = document.getElementById("searchInput").value;
    // Redirect to products.html with the search query as a URL parameter
    window.location.href = `products.html?search=${searchInput}`;
}
// Function to navigate to the product page of a selected category
function goToProducts(category) {
    window.location.href = `products.html?category=${category}`;
}