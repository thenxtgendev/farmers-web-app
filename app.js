console.log("app.js loaded successfully");
window.ACCESS_TOKEN = '00DNS000003FCNJ!AQEAQM4eL3.ojdbvG_fTrkeEdmbJUGmjj7.hk_VTiU87Qo817krBqH616sv.dfAgZbBnCgpQV0Ccq5uH3f_olFIPmwR8IbQG';

let cart = [];

// Function to handle search input
function handleSearch() {
    const query = document.getElementById('search-bar').value.trim();

    // Only search if the query is 3 characters or longer
    if (query.length >= 3) {
        fetchSearchResults(query);
    } else {
        clearProductResults();
    }
}

// Function to fetch product search results
async function fetchSearchResults(query) {
    document.getElementById('search-results').classList.remove('hidden');
    const products = await fetchProducts(query);
    displayProducts(products);
}



// Fetch products from Salesforce API
async function fetchProducts(query) {
    try {
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/products?query=' + encodeURIComponent(query), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${window.ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('RESPONSE FROM SALESFORCE'+ JSON.stringify(data));
            // Map the fields to display the updated structure
            return data.map(product => ({
                id: product.Name,
                name: product.Product_Name__c,
                category: product.Category__c,
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

// Function to display products filtered by category
function displayCategoryProducts(products) {
    const categoryTableBody = document.getElementById('category-results').querySelector('tbody');
    categoryTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>
                <input type="number" id="quantity-${product.name}" min="1" value="${product.quantity}">
            </td>
            <td><button onclick="addToCart('${product.name}', '${product.price}')">Add to Cart</button></td>
        `;
        categoryTableBody.appendChild(row);
    });

    document.getElementById('category-results').classList.remove('hidden');
}

// Function to fetch products by category from Salesforce API
async function fetchProductsByCategory(category) {
    try {
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/products?query=' + encodeURIComponent(category), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${window.ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('RESPONSE FROM SALESFORCE'+ JSON.stringify(data));
            const filteredProducts = data.map(product => ({
                id: product.Name,
                name: product.Product_Name__c,
                category: product.Category__c,
                price: product.Price__c,
                quantity: product.Quantity__c
            }));
            displayCategoryProducts(filteredProducts);
        } else {
            console.error('Failed to fetch products by category:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
}

// Function to display product results
function displayProducts(products) {
    const productTableBody = document.getElementById('product-results').querySelector('tbody');
    productTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>
                <input type="number" id="quantity-${product.name}" min="1" value="${product.quantity}">
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

// Function to clear product search results
function clearProductResults() {
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('product-results').querySelector('tbody').innerHTML = "";
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
        console.log('REQUEST FROM APP CART'+JSON.stringify({ items: cart }));
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/processOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.ACCESS_TOKEN}`
            },
            body: JSON.stringify({ items: cart })
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Order placed successfully! Order ID: ${result.orderId}`);
            cart = [];
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

function logOut() {
    alert('Log out functionality coming soon!');
}

async function fetchOrders() {
    try {
        const response = await fetch('https://dttl-c-dev-ed.develop.my.salesforce.com/services/apexrest/processOrder', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${window.ACCESS_TOKEN}`
            }
        });

        if (response.ok) {
            const rawData = await response.text();
            console.log("Raw Orders Response:", rawData);
            let data = JSON.parse(rawData);
            console.log("Type of data:", typeof data);
            console.log("RESPONSE FROM SALESFORCE:", data);

            if (!Array.isArray(data)) {
                if (typeof data === "string") {
                    data = JSON.parse(data);
                } else if (data.orders) {
                    data = data.orders;
                }
            }
            if (Array.isArray(data)) {
                displayOrders(data);
            } else {
                console.error("Data is still not an array after parsing/unwrapping:", data);
            }
        } else {
            console.error('Failed to fetch orders:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to display orders as cards
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = "";

    if (!Array.isArray(orders)) {
        console.error("displayOrders expects an array but got:", orders);
        return;
    }

    orders.forEach(order => {
        let totalPrice = 0;
        const lineItemsHTML = order.lineItems.map(item => {
            const productTotal = parseFloat(item.price) * parseInt(item.quantity);
            totalPrice += productTotal;

            return `
                <div style="font-size: 14px; margin-bottom: 5px;">
                    ${item.name} x${item.quantity} - ₹${productTotal.toFixed(2)}
                </div>
            `;
        }).join("");

        const orderCard = document.createElement('div');
        orderCard.style = `
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            width: 250px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
        `;
        orderCard.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                Order #: ${order.orderNumber}
            </div>
            <div>${lineItemsHTML}</div>
            <div style="font-size: 16px; font-weight: bold; margin-top: 10px; text-align: right;">
                Total: ₹${totalPrice.toFixed(2)}
            </div>
        `;

        ordersContainer.appendChild(orderCard);
    });

    document.getElementById('orders-section').classList.remove('hidden');
}