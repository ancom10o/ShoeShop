//Slider
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const slidesContainer = document.querySelector(".slides");

function showSlide(index) {
    if (index >= totalSlides) slideIndex = 0;
    if (index < 0) slideIndex = totalSlides - 1;

    slidesContainer.style.transform = `translateX(-${slideIndex * 100}vw)`;
}

function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
}

setInterval(() => changeSlide(1), 5000);


document.addEventListener("DOMContentLoaded", function () {
    // Nạp header
    fetch("/header.html")
        .then(response => response.text())
        .then(data => {document.querySelector(".header").innerHTML = data 
                const script = document.createElement("script");
                script.src = "../header.js";
                document.body.appendChild(script);});
    // Nạp footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.querySelector(".footer").innerHTML = data);
});
//Sale - home
document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const sale50_70 = document.querySelector(".sale-list.sale-50-70");
            const sale30_50 = document.querySelector(".sale-list.sale-30-50");
            const sale10_30 = document.querySelector(".sale-list.sale-10-30");

            const products50_70 = data.filter(product => product.sale >= 0.5 && product.sale <= 0.7).slice(0, 12);
            const products30_50 = data.filter(product => product.sale >= 0.3 && product.sale < 0.5).slice(0, 12);
            const products10_30 = data.filter(product => product.sale >= 0.1 && product.sale < 0.3).slice(0, 12);

            function renderProducts(container, products) {
                container.innerHTML = "";
                products.forEach(product => {
                    const productDiv = document.createElement("div");
                    productDiv.classList.add("product");
            
                    productDiv.innerHTML = `
                        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price.toLocaleString()}₫</p>
                        <p class="old-price">${product.oldPrice.toLocaleString()}₫</p>
                        <p style="padding: 3px" class="discount">-${Math.round(product.sale * 100)}%</p>
                    `;
            
                    // Thêm sự kiện click vào sản phẩm
                    productDiv.addEventListener("click", function () {
                        localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu vào localStorage
                        window.location.href = `product.html?id=${product.id}`;
                    });
            
                    container.appendChild(productDiv);
                });
            }

            // Hiển thị sản phẩm vào từng danh mục
            renderProducts(sale50_70, products50_70);
            renderProducts(sale30_50, products30_50);
            renderProducts(sale10_30, products10_30);
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));

    // Xử lý chuyển tab
    const tabs = document.querySelectorAll(".sale-tab");
    const lists = document.querySelectorAll(".sale-list");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            lists.forEach(l => l.classList.remove("active"));

            this.classList.add("active");
            document.querySelector("." + this.dataset.target).classList.add("active");
        });
    });
});


