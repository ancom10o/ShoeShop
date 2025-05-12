document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".product-grid");
    const paginationContainer = document.querySelector(".pagination");
    const searchInput = document.getElementById("search-input");

    let currentPage = 1;
    const itemsPerPage = 15;
    let productsData = [];
    let filteredProducts = [];

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("search");

    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            productsData = data;

            if (keyword) {
                searchInput.value = keyword;
                searchProducts(keyword);
            } else {
                filteredProducts = productsData;
            }

            createPaginationButtons();
            renderPage(currentPage);
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));

    function searchProducts(keyword) {
        filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(keyword.toLowerCase())
        );
        currentPage = 1;
        renderPage(currentPage);
    }


    function renderPage(page) {
        container.innerHTML = "";
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsToShow = filteredProducts.slice(start, end);

        productsToShow.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString()}₫</p>
                <p class="old-price">${product.oldPrice.toLocaleString()}₫</p>
                <p class="discount">-${Math.round(product.sale * 100)}%</p>
            `;

            productDiv.addEventListener("click", function () {
                localStorage.setItem("selectedProduct", JSON.stringify(product));
                window.location.href = `product.html?id=${product.id}`;
            });

            container.appendChild(productDiv);
        });

        createPaginationButtons();
    }

    function createPaginationButtons() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.innerText = i;
            button.classList.add("page-btn");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", function () {
                currentPage = i;
                renderPage(currentPage);
                updateActiveButton();
            });

            paginationContainer.appendChild(button);
        }
    }

    function updateActiveButton() {
        document.querySelectorAll(".page-btn").forEach(button => {
            button.classList.remove("active");
        });
        document.querySelectorAll(".page-btn")[currentPage - 1].classList.add("active");
    }

    function searchProducts() {
        const keyword = searchInput.value.toLowerCase().trim();
        filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(keyword)
        );

        currentPage = 1;
        renderPage(currentPage);
    }

    searchInput.addEventListener("keyup", searchProducts);

    // Nạp header và footer
    fetch("header.html")
        .then(response => response.text())
        .then(data => document.querySelector(".header").innerHTML = data);

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.querySelector(".footer").innerHTML = data);
});
