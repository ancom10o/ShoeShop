
document.addEventListener('DOMContentLoaded', function() {
    function displayCartItems() {
        const cartItemsDiv = document.getElementById('cart-items');
        const subtotalSpan = document.getElementById('subtotal');
        const totalSpan = document.getElementById('total');
        const emptyCartDiv = document.getElementById('empty-cart'); 

        cartItemsDiv.innerHTML = ''; 
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let subtotal = 0;

        if (cart.length === 0) {
            emptyCartDiv.style.display = "flex";
            return;
        } else {
            emptyCartDiv.style.display = "none"; 
        }
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
               <div class="product-info"> 
                    <p class="item-name">${item.name}</p>
                    <p class="item-color">Màu: ${item.color}</p> 
                    <p class="item-size">Kích thước: ${item.size}</p> 
                    <p class="item-price">
                        ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        ${item.oldPrice && item.oldPrice > item.price ? `
                            <span class="item-old-price" style="text-decoration: line-through; color: #888; margin-left: 10px;">
                                ${item.oldPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>` : ''}
                    </p>
                </div>
                <div">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Xóa </button>
        `;
        
        
            cartItemsDiv.appendChild(itemDiv);
            subtotal += item.price * item.quantity;
        });

        subtotalSpan.textContent = subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        const shippingFee = 20000;
        const total = subtotal + shippingFee;
        totalSpan.textContent = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    function handleQuantityChange(event) {
        const index = parseInt(event.target.dataset.index);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart[index];
        const quantitySpan = event.target.parentElement.querySelector('.quantity');

        if (event.target.classList.contains('plus')) {
            item.quantity++;
        } else if (event.target.classList.contains('minus') && item.quantity > 1) {
            item.quantity--;
        }

        quantitySpan.textContent = item.quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); 
    }

    function handleRemoveItem(event) {
        const index = parseInt(event.target.dataset.index);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); 
    }

    displayCartItems(); 
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("/header.html")
    .then(response => response.text())
    .then(data => {
        document.querySelector(".header").innerHTML = data;
        updateCartCount(); 
    });
    // Nạp footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.querySelector(".footer").innerHTML = data);
});
//update số lượng 
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = totalQuantity;
        cartCountSpan.style.display = totalQuantity > 0 ? 'inline-block' : 'none';
    }
}
// Nếu giỏ trống
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    const emptyCartDiv = document.getElementById('empty-cart'); // Div thông báo giỏ hàng trống

    cartItemsDiv.innerHTML = '';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartDiv.style.display = "flex"; 
        return;
    } else {
        emptyCartDiv.style.display = "none";
    }
}
  function displayProductList() {
        const productListDiv = document.getElementById('product-list');
        productListDiv.innerHTML = '';
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cart.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div>
                    <p><strong>${item.name}</strong></p>
                    <p>Màu sắc: ${item.color}</p>
                    <p>Kích thước: ${item.size}</p>
                    <p class="price">
                        ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        ${item.oldPrice && item.oldPrice > item.price ? `
                            <span class="item-old-price" style="text-decoration: line-through; color: #888; margin-left: 10px;">
                                ${item.oldPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>` : ''}
                    </p>
                    <p>Số lượng: ${item.quantity}</p>
                </div>
            `;

            productListDiv.appendChild(productDiv);
        });
    }
    