// Function to navigate to the product page of a selected category
function goToProducts(subcategory) {
    window.location.href = `products.html?subcategory=${subcategory}`;
}

function toggleSubcategories(categoryElement) {
    // Get all category elements
    const allCategories = document.querySelectorAll('.category');

    // Collapse all categories except the one clicked
    allCategories.forEach(category => {
        if (category !== categoryElement) {
            category.classList.remove('active');
        }
    });

    // Toggle the clicked category
    categoryElement.classList.toggle('active');
}