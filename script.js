const products = [
    {
        id: 1,
        name: "Fresh Whole Chicken",
        price: 85.00,
        description: "Farm-fresh whole chicken, cleaned and ready to cook.",
        image: "images/whole-chicken.png"
    },
    {
        id: 2,
        name: "Chicken Breast Fillets",
        price: 45.00,
        description: "Boneless, skinless chicken breast fillets. Pack of 500g.",
        image: "images/chicken-fillets.png"
    },
    {
        id: 3,
        name: "Chicken Drumsticks",
        price: 35.00,
        description: "Juicy chicken drumsticks. Pack of 6 pieces.",
        image: "images/chicken-drumsticks.png"
    },
    {
        id: 4,
        name: "Chicken Wings",
        price: 30.00,
        description: "Fresh chicken wings. Pack of 10 pieces.",
        image: "images/chicken-wings.png"
    },
    {
        id: 5,
        name: "Chicken Thighs",
        price: 40.00,
        description: "Tender chicken thighs. Pack of 4 pieces.",
        image: "images/chicken-thighs.png"
    },
    {
        id: 6,
        name: "Free Range Eggs",
        price: 20.00,
        description: "Farm-fresh free-range eggs. Tray of 12.",
        image: "images/eggs.png"
    }
];

// Global variables
let cart = [];
let selectedDeliveryOption = null;
let selectedPaymentOption = null;
let deliveryFee = 0;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const closeModalBtn = document.querySelector('.close-modal');
const cartBtn = document.getElementById('cartBtn');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartDisplay();
    setupEventListeners();
    generateRandomOrderNumber();
});

// Load products to the page
function loadProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">GH₵ ${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Cart modal
    cartBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeModal();
        }
    });

    // Delivery options
    const deliveryOptions = document.querySelectorAll('.delivery-options .option-card');
    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            deliveryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedDeliveryOption = option.dataset.option;
            
            // Update delivery fee
            if (selectedDeliveryOption === 'standard') {
                deliveryFee = 15.00;
            } else if (selectedDeliveryOption === 'express') {
                deliveryFee = 30.00;
            } else {
                deliveryFee = 0.00;
            }
            
            updateCartSummary();
        });
    });

    // Payment options
    const paymentOptions = document.querySelectorAll('.payment-options .option-card');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedPaymentOption = option.dataset.option;
            
            // Show/hide relevant payment fields
            document.getElementById('momoFields').style.display = 
                selectedPaymentOption === 'momo' ? 'block' : 'none';
            document.getElementById('cardFields').style.display = 
                selectedPaymentOption === 'card' ? 'block' : 'none';
        });
    });

    // Contact form
    document.getElementById('sendMessageBtn').addEventListener('click', () => {
        const name = document.getElementById('contactName').value;
        if (name) {
            alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactSubject').value = '';
            document.getElementById('contactMessage').value = '';
        } else {
            alert('Please fill in your name.');
        }
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    alert(`${product.name} added to cart!`);
}

// Update cart quantity
function updateCartQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += change;
        
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCartDisplay();
    }
}

// Update cart display in all places
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const modalCartItems = document.getElementById('modalCartItems');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartBadge.textContent = totalItems;
    
    // If cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add some products first!</div>';
        modalCartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add some products first!</div>';
        document.getElementById('placeOrderBtn').disabled = true;
    } else {
        document.getElementById('placeOrderBtn').disabled = false;
        
        // Update main cart
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItems.appendChild(cartItemElement);
        });
        
        // Update modal cart
        modalCartItems.innerHTML = '';
        cart.forEach(item => {
            const modalCartItemElement = createCartItemElement(item);
            modalCartItems.appendChild(modalCartItemElement);
        });
    }
    
    updateCartSummary();
}

// Create cart item element
function createCartItemElement(item) {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
        <div class="cart-item-details">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div>
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">GH₵ ${item.price.toFixed(2)}</p>
            </div>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
        </div>
    `;
    return cartItemElement;
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    
    // Update order page summary
    document.querySelector('#cartSummary .summary-row:nth-child(1) span:last-child').textContent = 
        `GH₵ ${subtotal.toFixed(2)}`;
    document.querySelector('#cartSummary .summary-row:nth-child(2) span:last-child').textContent = 
        `GH₵ ${deliveryFee.toFixed(2)}`;
    document.querySelector('#cartSummary .summary-row.total span:last-child').textContent = 
        `GH₵ ${total.toFixed(2)}`;
    
    // Update payment page summary
    document.getElementById('payment-subtotal').textContent = `GH₵ ${subtotal.toFixed(2)}`;
    document.getElementById('payment-delivery').textContent = `GH₵ ${deliveryFee.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `GH₵ ${total.toFixed(2)}`;
    
    // Update modal summary
    document.getElementById('modal-cart-total').textContent = `GH₵ ${subtotal.toFixed(2)}`;
}

// Order steps navigation
function continueToStep(step) {
    if (step === 'delivery' && cart.length === 0) {
        alert('Your cart is empty. Please add some products first.');
        return;
    }
    
    if (step === 'payment' && !selectedDeliveryOption) {
        alert('Please select a delivery option.');
        return;
    }
    
    if (step === 'confirmation' && !selectedPaymentOption) {
        alert('Please select a payment method.');
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Deactivate all step indicators
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show the selected step
    document.getElementById(`${step}-step`).classList.add('active');
    
    // Activate the step indicator
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    // If confirmation step, process the order
    if (step === 'confirmation') {
        // In a real application, you would send the order to a server here
        // Reset cart after successful order
        cart = [];
        updateCartDisplay();
    }
}

// Go back to previous step
function backToStep(step) {
    continueToStep(step);
}

// Open cart modal
function openModal() {
    cartModal.style.display = 'flex';
}

// Close cart modal
function closeModal() {
    cartModal.style.display = 'none';
}

// Scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Generate random order number
function generateRandomOrderNumber() {
    const randomNum = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('orderNumber').textContent = `BLP-${randomNum}`;
}