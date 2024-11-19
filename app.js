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

// Update the Salesforce access token here
const ACCESS_TOKEN = '00DNS000003FCNJ!AQEAQELCUzori11XAXRHxYNqN5U60FEOwu5SlhwxZAbs9W.kB00H6a47ktf9FEe9z0x8txLP1T_wKzRGxQUatKzqTjLJ.dUC';

// Fetch products from Salesforce API
async function fetchProducts(query) {
    try {
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/products?query=' + encodeURIComponent(query), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Map the fields to display the updated structure
            return data.map(product => ({
                name: product.Product_Name__c,
                price: product.Price__c,
                quantity: product.Quantity__c
            }));
        } else {
            console.error('Failed to fetch products:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}


// Function to fetch products by category
function fetchProductsByCategory(category) {
    alert(`Fetching products for category: ${category}`);

    // Placeholder for fetching products from Salesforce API
    const products = [
        { name: "Organic Seeds", price: "$20", quantity: 50, category: "seeds" },
        { name: "Fertilizer A", price: "$15", quantity: 30, category: "fertilizers" },
        { name: "Pesticide B", price: "$12", quantity: 75, category: "pesticides" },
        { name: "Herbicide C", price: "$10", quantity: 40, category: "herbicides" },
        { name: "Livestock Feed D", price: "$25", quantity: 20, category: "livestock feed" },
        { name: "Farm Machinery E", price: "$1000", quantity: 5, category: "farm machinery" }
    ];

    // Filter products by the selected category
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
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

// Function to process the order using Salesforce API
async function processOrder() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    try {
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/processOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity.toString(),
                    price: item.price.toString()
                }))
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Order placed successfully!`);
            cart = []; // Clear the cart after a successful order
            updateCartDisplay();
        } else {
            console.error('Failed to process order:', response.statusText);
            alert('Failed to process order. Please try again.');
        }
    } catch (error) {
        console.error('Error processing order:', error);
        alert('An error occurred while placing the order.');
    }
}

