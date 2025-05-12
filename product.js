// Khai báo biến toàn cục để sử dụng trong các hàm
let currentProduct = null;

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id")); // Lấy ID từ URL
    
    if (!productId) {
        showError("Không tìm thấy ID sản phẩm trong URL.");
        return;
    }
    
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải dữ liệu sản phẩm");
            }
            return response.json();
        })
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                currentProduct = product;
                renderProduct(product);
                setupEventListeners();
            } else {
                showError("Không tìm thấy sản phẩm với ID " + productId);
            }
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
            showError("Đã xảy ra lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        });
});

function showError(message) {
    document.querySelector(".detail-product").innerHTML = `
        <div style="text-align: center; padding: 50px; color: #e63946;">
            <h2>Lỗi</h2>
            <p>${message}</p>
            <a href="index.html" style="display: inline-block; margin-top: 20px; color: #333; text-decoration: none; padding: 10px 20px; border: 1px solid #333; border-radius: 5px;">Quay lại trang chủ</a>
        </div>
    `;
}

function renderProduct(product) {
    // Kiểm tra và sử dụng các giá trị mặc định nếu dữ liệu thiếu
    const defaultImage = "/api/placeholder/400/320";
    const image = product.image || defaultImage;
    const gallery = product.gallery || [image, image, image];
    const colors = product.colors || [product.color || "Mặc định"];
    const sizes = product.sizes || ["39", "40", "41", "42"];
    const code = product.code || `${product.brand}-${product.id}`;
    
    // Cập nhật thông tin cơ bản
    document.querySelector(".product-name").innerText = product.name;
    document.querySelector(".product-id").innerText = `Mã sản phẩm: ${code}`;
    
    // Cập nhật thông tin giá
    document.querySelector(".price").innerHTML = `
        <span class="new-price">${product.price.toLocaleString()}₫</span>
        <span class="old-price">${product.oldPrice.toLocaleString()}₫</span>
        <span class="discount">-${Math.round(product.sale * 100)}%</span>
    `;
     
    // Cập nhật thông tin tồn kho
    document.querySelector(".stock-info").innerHTML = product.stock > 0 
        ? `<span style="color: green;">✓ Còn hàng (${product.stock})</span>` 
        : `<span style="color: red;">✕ Hết hàng</span>`;
    
    // Cập nhật ảnh chính
    document.querySelector(".img").innerHTML = `<img src="${image}" alt="${product.name}">`;
    
    // Cập nhật thư viện ảnh
    document.querySelector(".img-gallery").innerHTML = gallery.map(img =>
        `<img src="${img}" class="small-img" onclick="changeImage('${img}')">`
    ).join("");
    
    // Cập nhật tùy chọn màu sắc
    document.querySelector(".colors").innerHTML = colors.map(color =>
        `<button class="color-btn" data-color="${color}">${color}</button>`
    ).join("");
    
    // Cập nhật tùy chọn kích thước
    document.querySelector(".sizes").innerHTML = sizes.map(size =>
        `<button class="size-btn" data-size="${size}">${size}</button>`
    ).join("");
    
    // Cập nhật thông tin chi tiết sản phẩm
    document.querySelector(".brand-info").innerHTML = `<strong>Thương hiệu:</strong> ${product.brand}`;
    document.querySelector(".category-info").innerHTML = `<strong>Danh mục:</strong> ${product.category}`;
    document.querySelector(".gender-info").innerHTML = `<strong>Giới tính:</strong> ${product.gender}`;
}

function setupEventListeners() {
    // Xử lý chọn màu sắc
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            document.querySelector(".selected-color").textContent = this.dataset.color;
            clearErrorMessage();
        });
    });
    
    // Xử lý chọn kích thước
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            document.querySelector(".selected-size").textContent = this.dataset.size;
            clearErrorMessage();
        });
    });
    
    // Xử lý tăng giảm số lượng
    let qty = 1;
    const qtyElement = document.querySelector(".qty");
    
    document.querySelector(".increase").addEventListener("click", () => {
        if (qty < currentProduct.stock) {
            qty++;
            qtyElement.innerText = qty;
            clearErrorMessage();
        } else {
            showErrorMessage("Số lượng đã đạt mức tối đa có sẵn.");
        }
    });
    
    document.querySelector(".decrease").addEventListener("click", () => {
        if (qty > 1) {
            qty--;
            qtyElement.innerText = qty;
            clearErrorMessage();
        }
    });
    

    // Xử lý mua ngay
    document.querySelector(".buy-now").addEventListener("click", () => {
        if (validateSelection()) {
            alert("Đang chuyển đến trang thanh toán...");
        }
    });
}

function validateSelection() {
    if (!document.querySelector(".color-btn.active")) {
        showErrorMessage("Vui lòng chọn màu sắc.");
        return false;
    }
    
    if (!document.querySelector(".size-btn.active")) {
        showErrorMessage("Vui lòng chọn kích thước.");
        return false;
    }
    
    return true;
}

function showErrorMessage(message) {
    const errorElement = document.querySelector(".error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function clearErrorMessage() {
    const errorElement = document.querySelector(".error-message");
    errorElement.textContent = "";
    errorElement.style.display = "none";
}

function changeImage(img) {
    document.querySelector(".img img").src = img;
}

document.addEventListener("DOMContentLoaded", function () {
    // Nạp header
    fetch("/header.html")
        .then(response => response.text())
        .then(data => document.querySelector(".header").innerHTML = data);

    // Nạp footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.querySelector(".footer").innerHTML = data);
});
//localStorage
function addToCart(name, price, image, color, size, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.name === name && item.color === color && item.size === size);
    if (existingProduct) {
        existingProduct.quantity += quantity; // Nếu có, tăng số lượng
    } else {
        cart.push({ name, price, image, color, size, quantity }); // Nếu chưa có, thêm mới
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Lưu vào localStorage
}
// thêm vào giỏ hàng 
function setupAddToCartAnimation() {
    const addToCartButton = document.querySelector(".add-to-cart");
    const productImage = document.querySelector(".img img");
    const cartIcon = document.querySelector(".header .cart-icon"); 
    
    if (!addToCartButton || !productImage) return;
    
    addToCartButton.addEventListener("click", function() {
        if (!validateSelection()) return;
        
        const imgClone = productImage.cloneNode(true);
        const rect = productImage.getBoundingClientRect();
        
        Object.assign(imgClone.style, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            opacity: '0.8',
            zIndex: '1000',
            transition: 'all 0.8s ease-in-out',
            pointerEvents: 'none'
        });
        
        document.body.appendChild(imgClone);
        
        const cartRect = cartIcon ? cartIcon.getBoundingClientRect() : 
            { top: 20, right: 20, left: window.innerWidth - 110, width: 30, height: 30 };
        
        // Di chuyển ảnh đến giỏ hàng
        setTimeout(() => {
            Object.assign(imgClone.style, {
                top: `${cartRect.top}px`,
                left: `${cartRect.left}px`,
                width: '30px',
                height: '30px',
                opacity: '0.2',
                transform: 'scale(0.3)'
            });
            
            // Hiển thị thông báo sau khi kết thúc animation
            setTimeout(() => {
                document.body.removeChild(imgClone);
                showSuccessMessage(); // Assuming showSuccessMessage() is defined elsewhere
            }, 800);
        }, 10);

          //get product info to save in local storage
          const productName = document.querySelector('.product-name').textContent;
          const priceElement = document.querySelector('.price .new-price');
          const oldpriceElement = document.querySelector('.price ')
          const colorElement = document.querySelector('.selected-color');
          const sizeElement = document.querySelector('.selected-size');
          const qtyElement = document.querySelector('.qty');
  
          if (priceElement && colorElement && sizeElement && qtyElement) {
              const productPrice = parseFloat(priceElement.textContent.replace(/[^0-9,]/g, '').replace(',', '.'));
              const productImageSrc = productImage.src;
              const productColor = colorElement.textContent;
              const productSize = sizeElement.textContent;
              const productQuantity = parseInt(qtyElement.textContent);
  
              if (!isNaN(productPrice)) {
                  addToCart(productName, productPrice, productImageSrc, productColor, productSize, productQuantity);
              } else {
                  console.error("Giá sản phẩm không hợp lệ:", priceElement.textContent);
              }
          } else {
              console.error("Không tìm thấy một trong các phần tử cần thiết.");
          }
    });
}

function showSuccessMessage() {
    // Tạo thông báo đơn giản
    const message = document.createElement('div');
    message.innerText = "✓ Thêm vào giỏ hàng thành công";
    
    // Thiết lập style cho thông báo
    Object.assign(message.style, {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '5px',
        zIndex: '1001',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: '0',
        transform: 'translateX(-50%) translateY(-20px)'
    });
    
    // Thêm vào body và hiển thị
    document.body.appendChild(message);
    
    // Hiệu ứng hiện lên
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(-50%) translateY(0)';
        
        // Tự động ẩn sau 2 giây
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(-50%) translateY(-20px)';
            
            // Xóa khỏi DOM sau khi ẩn
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }, 10);
}

// Đảm bảo gọi hàm này sau khi DOM đã tải xong
function updateSetupEventListeners() {
    // Giữ lại các event listeners hiện có của bạn từ product.js
    const originalSetupEventListeners = window.setupEventListeners || function() {};
    
    // Ghi đè hàm setupEventListeners
    window.setupEventListeners = function() {
        // Gọi hàm gốc
        originalSetupEventListeners();
        
        // Thêm hiệu ứng mới
        setupAddToCartAnimation();
    };
}

// Thực thi ngay khi script được tải
updateSetupEventListeners();


