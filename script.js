document.addEventListener('DOMContentLoaded', () => {
    // ---- VARIABLES & INITIAL SETUP ----
    const cartCountSpan = document.getElementById('cart-count');
    const productsContainer = document.querySelector('.product-gallery');
    const uploadForm = document.getElementById('upload-form');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    const orderForm = document.getElementById('order-form');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // ---- FUNCTIONS ----
    
    // Updates the cart count in the header on every page
    function updateCartCount() {
        if (cartCountSpan) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = totalItems;
        }
    }

    // Renders the product gallery on the product page (index.html)
    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '<h2>Our Products</h2>';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₦${product.price.toLocaleString('en-NG')}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Renders the cart items on the checkout page (checkout.html)
    function renderCart() {
        if (!cartItemsContainer || !totalElement) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        }
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span>${product.name} x${item.quantity}</span>
                    <span>₦${(product.price * item.quantity).toLocaleString('en-NG')}</span>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += product.price * item.quantity;
            }
        });
        totalElement.textContent = `Total: ₦${total.toLocaleString('en-NG')}`;
    }

    // ---- EVENT LISTENERS ----

    // Handles product upload form submission on upload.html
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const price = document.getElementById('product-price').value;
            const imageFile = document.getElementById('product-image').files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newProduct = {
                        id: Date.now(),
                        name: name,
                        price: parseFloat(price),
                        image: event.target.result
                    };
                    products.push(newProduct);
                    localStorage.setItem('products', JSON.stringify(products));
                    alert('Product uploaded successfully!');
                    uploadForm.reset();
                };
                reader.readAsDataURL(imageFile);
            }
        });
    }

    // Handles "Add to Cart" button clicks on index.html
    if (productsContainer) {
        productsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ id: productId, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                alert('Product added to cart!');
            }
        });
    }

    // Handles order placement on checkout.html
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const fullName = document.getElementById('full-name').value;
            const address = document.getElementById('delivery-address').value;
            const total = totalElement.textContent;

            alert(`Order Placed for ${fullName}!\n\nDelivery Address: ${address}\n\n${total}\n\nThank you for your order! You will pay on delivery.`);

            // Clear the cart
            localStorage.removeItem('cart');
            cart = [];
            updateCartCount();
            renderCart();
            orderForm.reset();
        });
    }

    // ---- INITIAL RENDER CALLS ----
    renderProducts();
    renderCart();
    updateCartCount();

    // ---- CAROUSEL SLIDER LOGIC ----
    const slidesContainer = document.querySelector('.slides-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    const totalSlides = slidesContainer.children.length;

    function goToSlide(index) {
        slidesContainer.style.transform = `translateX(${-index * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    });

    // Optional: Add auto-play functionality
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds
});