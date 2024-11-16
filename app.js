// Handle search input
function handleSearch() {
    const query = document.getElementById('search-bar').value.trim();
    if (query.length >= 3) {
        fetchSearchResults(query);
    } else {
        clearResults();
    }
}

// Fetch search results (Simulated for now)
async function fetchSearchResults(query) {
    document.getElementById('search-results').classList.remove('hidden');
    const products = await fetchProducts(query);
    displayProducts(products);

    const orders = await fetchOrders(query);
    displayOrders(orders);
}

// Simulated function to fetch products (Replace with Salesforce API)
async function fetchProducts(query) {
    return [
        { name: "Organic Seeds", price: "$20", quantity: 50 },
        { name: "Pesticides", price: "$15", quantity: 100 },
        { name: "Herbicide", price: "$12", quantity: 75 }
    ].filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}

// Simulated function to fetch orders (Replace with Salesforce API)
async function fetchOrders(query) {
    return [
        { orderId: "ORD001", product: "Organic Seeds", quantity: 10 },
        { orderId: "ORD002", product: "Pesticides", quantity: 5 },
        { orderId: "ORD003", product: "Herbicide", quantity: 8 }
    ].filter(order => order.product.toLowerCase().includes(query.toLowerCase()));
}

// Display product results
function displayProducts(products) {
    const productTableBody = document.getElementById('product-results').querySelector('tbody');
    productTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${product.name}</td><td>${product.price}</td><td>${product.quantity}</td>`;
        productTableBody.appendChild(row);
    });
}

// Display order results
function displayOrders(orders) {
    const orderTableBody = document.getElementById('order-results').querySelector('tbody');
    orderTableBody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${order.orderId}</td><td>${order.product}</td><td>${order.quantity}</td>`;
        orderTableBody.appendChild(row);
    });
}

// Fetch products by category (Placeholder)
function fetchProductsByCategory(category) {
    alert(`Fetching products for category: ${category}`);
    // TODO: Fetch products from Salesforce API based on category
}

// Handle cart functionality (Placeholder)
function processOrder() {
    alert('Order processed successfully!');
    // TODO: Call Salesforce API to place order
}

// Clear search results
function clearResults() {
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('product-results').querySelector('tbody').innerHTML = "";
    document.getElementById('order-results').querySelector('tbody').innerHTML = "";
}
