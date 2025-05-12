document.addEventListener("DOMContentLoaded", function () {
    const imageContainer = document.querySelector(".image-container");
    const fileInput = document.getElementById("fileInput");
    const addImageBox = document.querySelector(".add-image");
    const maxImages = 7;

    // Khi click vào "Thêm ảnh sản phẩm" → mở file browser
    addImageBox.addEventListener("click", function () {
        if (imageContainer.querySelectorAll(".image-box").length - 1 < maxImages) {
            fileInput.click();
        }
    });

    // Khi chọn ảnh từ máy tính
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                addImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Thêm ảnh vào danh sách
    function addImage(src) {
        if (imageContainer.querySelectorAll(".image-box").length - 1 >= maxImages) {
            return;
        }

        const imageBox = document.createElement("div");
        imageBox.classList.add("image-box");
        imageBox.innerHTML = `<img src="${src}" alt="Sản phẩm">
                              <button class="remove-btn">✖</button>`;

        // Thêm vào danh sách trước nút "Thêm ảnh sản phẩm"
        imageContainer.insertBefore(imageBox, addImageBox);

        // Gán sự kiện xóa ảnh
        imageBox.querySelector(".remove-btn").addEventListener("click", function () {
            imageBox.remove();
            checkImageLimit();
        });

        checkImageLimit();
    }

    // Kiểm tra số lượng ảnh và ẩn/hiện nút "Thêm ảnh sản phẩm"
    function checkImageLimit() {
        if (imageContainer.querySelectorAll(".image-box").length - 1 >= maxImages) {
            addImageBox.style.display = "none";
        } else {
            addImageBox.style.display = "flex";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addProductBtn");
    // const saveBtn = document.querySelector(".submit-btn");
    // const deleteBtn = document.querySelector(".det-btn");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const overlay = document.getElementById("overlay");
    const closePopup = document.getElementById("closePopup");

    function showPopup(message) {
        popupMessage.innerText = message; 
        popup.style.display = "block";
        overlay.style.display = "block";
    }

    if (addButton) {
        addButton.addEventListener("click", function () {
            showPopup("Sản phẩm đã được thêm thành công!");
        });
    }

   

    // if (deleteBtn) {
    //     deleteBtn.addEventListener("click", function () {
    //         showPopup("Sản phẩm đã được xóa thành công!");
    //     });
    // }

    closePopup.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    overlay.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });
});


