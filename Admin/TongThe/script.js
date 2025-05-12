const itemsPerPage = 10;
let currentPage = 1;
let products = []; // Danh sách toàn bộ sản phẩm

// Tìm kiếm sản phẩm
function searchProducts() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.Name.toLowerCase().includes(searchInput) ||
        product.Color.toLowerCase().includes(searchInput)
    );
    currentPage = 1;
    displayProducts(filteredProducts);
}

// Hiển thị sản phẩm theo trang
function displayProducts(filteredProducts = products) {
    const productList = document.querySelector(".product-list");
    productList.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    paginatedProducts.forEach(item => {
        const product = `
            <div class="product">
                <img src="${item.Images}" alt="${item.Name}">
                <div class="product-info">
                    <strong>${item.Name}</strong>
                    <p>Kho: ${item.Stock}</p>
                    <p>Màu sắc: ${item.Color}</p>
                </div>
                <a href="/Admin/QuanLySP/ChinhSuaSP.html?productID=${item.Product_ID}">
                    <button class="edit-btn">Chỉnh sửa</button>
                </a>
            </div>
        `;
        productList.innerHTML += product;
    });

    updatePagination(filteredProducts);
}

// Cập nhật phân trang
function updatePagination(filteredProducts) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.classList.add("page-btn");
        if (i === currentPage) pageButton.classList.add("active");
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayProducts(filteredProducts);
        });
        pagination.appendChild(pageButton);
    }
}

// Gọi API và khởi tạo
async function getProductListAll() {
    try {
        const response = await fetch('http://localhost:3000/getProductListAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        products = result;
        displayProducts(); // Gọi hiển thị ban đầu
    } catch (err) {
        console.error("Lỗi lấy dữ liệu sản phẩm:", err);
    }
}

document.addEventListener("DOMContentLoaded", getProductListAll);
