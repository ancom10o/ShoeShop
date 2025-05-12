document.addEventListener("DOMContentLoaded", function () {
    function displayProductList() {
        const productListDiv = document.querySelector('.product-list');
        const subtotalSpan = document.getElementById('subtotal'); 
        const totalSpan = document.getElementById('total');

        if (!productListDiv || !subtotalSpan || !totalSpan) return;

        productListDiv.innerHTML = ''; // Xóa dữ liệu cũ
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let subtotal = 0; // Tổng tiền hàng

        if (cart.length === 0) {
            productListDiv.innerHTML = '<p>Giỏ hàng trống.</p>';
            subtotalSpan.textContent = "0₫";
            totalSpan.textContent = "20.000₫"; // Chỉ có phí vận chuyển
            return;
        }

        cart.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-info">
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

            // Cộng dồn tổng tiền hàng
            subtotal += item.price * item.quantity;
        });

        // Cập nhật tổng tiền vào HTML
        subtotalSpan.textContent = subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        const shippingFee = 20000;
        const total = subtotal + shippingFee;
        totalSpan.textContent = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    displayProductList();
});
