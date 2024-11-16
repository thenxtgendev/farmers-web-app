console.log("app.js loaded successfully");

let cart = [];

// Function to handle search input
function handleSearch() {
    const query = document.getElementById('search-bar').value.trim();

    // Only search if the query is 3 characters or longer
    if (query.length >= 3) {
        fetchSearchResults(query);
    } else {
        clearResults();
    }
}

// Function to fetch search results (Simulated for now)
async function fetchSearchResults(query) {
    document.getElementById('search-results').classList.remove('hidden');
    const products = await fetchProducts(query);
    displayProducts(products);

    const orders = await fetchOrders(query);
    displayOrders(orders);
}

// Placeholder function to fetch products
async function fetchProducts(query) {
    // Example products data
    return [
        { name: "Organic Seeds", price: "$20", quantity: 50 },
        { name: "Pesticides", price: "$15", quantity: 100 },
        { name: "Herbicide", price: "$12", quantity: 75 }
    ].filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}

// Placeholder function to fetch orders
async function fetchOrders(query) {
    // Example orders data
    return [
        { orderId: "ORD001", product: "Organic Seeds", quantity: 10 },
        { orderId: "ORD002", product: "Pesticides", quantity: 5 },
        { orderId: "ORD003", product: "Herbicide", quantity: 8 }
    ].filter(order => order.product.toLowerCase().includes(query.toLowerCase()));
}

// Function to display product results
function displayProducts(products) {
    const productTableBody = document.getElementById('product-results').querySelector('tbody');
    productTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>
                <input type="number" id="quantity-${product.name}" min="1" value="1">
            </td>
            <td><button onclick="addToCart('${product.name}', '${product.price}')">Add to Cart</button></td>
        `;
        productTableBody.appendChild(row);
    });
}

// Function to display order results
function displayOrders(orders) {
    const orderTableBody = document.getElementById('order-results').querySelector('tbody');
    orderTableBody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${order.orderId}</td><td>${order.product}</td><td>${order.quantity}</td>`;
        orderTableBody.appendChild(row);
    });
}

// Function to clear search results
function clearResults() {
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('product-results').querySelector('tbody').innerHTML = "";
    document.getElementById('order-results').querySelector('tbody').innerHTML = "";
}

// Function to handle adding products to the cart
function addToCart(productName, price) {
    const quantityInput = document.getElementById(`quantity-${productName}`);
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ name: productName, price: price, quantity: quantity });
    }

    alert(`${productName} added to cart!`);
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartSection = document.getElementById('cart-section');
    const cartTableBody = document.getElementById('cart-table').querySelector('tbody');
    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
        cartSection.classList.add('hidden');
        return;
    }

    cartSection.classList.remove('hidden');

    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Function to process the order
async function processOrder() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    try {
        // Placeholder for Salesforce API call
        const response = await fetch('https://your-salesforce-endpoint.com/processOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Order placed successfully! Order ID: ${result.orderId}`);
            cart = []; // Clear the cart after a successful order
            updateCartDisplay();
        } else {
            alert('Failed to process order. Please try again.');
        }
    } catch (error) {
        console.error('Error processing order:', error);
        alert('An error occurred while placing the order.');
    }
}
