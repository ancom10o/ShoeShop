function initializeSearch() {
    const searchInput = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-button");
    const searchTable = document.querySelector(".search-table");

    if (!searchInput || !searchButton || !searchTable) return;

    let products = [];

    // Tải danh sách sản phẩm từ file JSON
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchTable.innerHTML = ""; 

        if (searchTerm === "") {
            searchTable.style.display = "none";
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        ).slice(0, 3); // Hiển thị tối đa 3 sản phẩm

        if (filteredProducts.length > 0) {
            searchTable.style.display = "block";

            filteredProducts.forEach(product => {
                const productItem = document.createElement("div");
                productItem.classList.add("search-item");
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-info">
                        <p>${product.name}</p>
                        <span class="price">${product.price.toLocaleString()} VNĐ</span>
                        <span class="old-price">${product.oldPrice.toLocaleString()} VNĐ</span>
                    </div>
                `;

                productItem.addEventListener("click", () => {
                    window.location.href = `product.html?id=${product.id}`;
                });

                searchTable.appendChild(productItem);
            });

            // Thêm dòng cuối cùng với liên kết "Xem tất cả sản phẩm"
            const viewAllItem = document.createElement("div");
            viewAllItem.classList.add("search-item", "view-all");
            viewAllItem.innerHTML = `
                <a href="more.html?search=${encodeURIComponent(searchTerm)}">
                    Xem nhiều hơn
                </a>
            `;
            searchTable.appendChild(viewAllItem);
        } else {
            searchTable.style.display = "none";
        }
    }

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") performSearch();
    });

    searchInput.addEventListener("input", function() {
        performSearch();
    });

    document.addEventListener("click", function(event) {
        if (!searchTable.contains(event.target) && !searchInput.contains(event.target)) {
            searchTable.style.display = "none";
        }
    });
}

// Kiểm tra và khởi tạo tìm kiếm khi header đã load
function checkAndInitSearch() {
    const header = document.querySelector('#header');
    if (header) {
        initializeSearch();
    } else {
        setTimeout(checkAndInitSearch, 100);
    }
}

checkAndInitSearch();
