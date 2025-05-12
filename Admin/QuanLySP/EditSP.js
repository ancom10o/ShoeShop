document.addEventListener("DOMContentLoaded", () => {
    (async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productID = urlParams.get("productID");

       
        if (!productID) return;

        try {
            const response = await fetch("http://localhost:3000/EditSP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({productID})
            });

            if (!response.ok) throw new Error("Không lấy được dữ liệu sản phẩm");

            const product = await response.json();

            
           document.getElementById("productName").value = product.Name || "";
document.getElementById("productCategory").value = product.Category || "Chạy bộ";
document.getElementById("productBrand").value = product.Brand || "Nike";
document.getElementById("productGender").value = product.Gender || "Nam";
document.getElementById("productPrice").value = product.UnitPrice || 0;
document.getElementById("Discount").value = product.Discount || 0;
document.getElementById("productQuantity").value = product.Stock || 0;
document.getElementById("productColor").value = product.Color || "";
document.getElementById("productSize").value = product.Size || "";

            
            console.log(product);

            const imageContainer = document.getElementById("imageContainer");
            imageContainer.innerHTML = `
                <div class="image-box">
                    <img src="${product.Images}" alt="Sản phẩm">
                    <button class="remove-btn">✖</button>
                </div>
                <div class="image-box add-image">Thêm ảnh sản phẩm</div>
                <input type="file" id="fileInput" accept="image/*" style="display: none;">
            `;
        } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        }


       document.querySelector(".submit-btn").addEventListener("click", async () => {
    const unitPrice = parseFloat(document.getElementById("productPrice").value);
    const discount = parseFloat(document.getElementById("Discount").value);
    const stock = parseInt(document.getElementById("productQuantity").value);


    if (!Number.isInteger(unitPrice) || unitPrice <= 0) {
        alert("Giá niêm yết phải là số nguyên dương lớn hơn 0.");
        return;
    }

    if (!Number.isInteger(stock) || stock <= 0) {
        alert("Số lượng phải là số nguyên dương lớn hơn 0.");
        return;
    }

    if (isNaN(discount) || discount < 0 || discount >= 1) {
        alert("Tỉ lệ giảm giá phải là số thập phân từ 0 đến nhỏ hơn 1.");
        return;
    }

    const updatedProduct = {
        Product_ID: productID,
        Name: document.getElementById("productName").value,
        Category: document.getElementById("productCategory").value,
        Brand: document.getElementById("productBrand").value,
        Gender: document.getElementById("productGender").value,
        UnitPrice: unitPrice,
        Discount: discount,
        Stock: stock,
        Color: document.getElementById("productColor").value,
        Size: document.getElementById("productSize").value,
        Description: document.querySelector("textarea")?.value || ""
    };

    try {
        const res = await fetch("http://localhost:3000/UpdateProduct", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        });

        const result = await res.json();
        alert("Cập nhật sản phẩm thành công!");
        // có thể thêm code chuyển hướng nếu cần
    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        alert("Đã xảy ra lỗi khi lưu sản phẩm.");
    }
});
document.querySelector(".det-btn").addEventListener("click", async () => {
   

    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    console.log("ds",productID)
    if (!confirmDelete) return;

    try {
        const res = await fetch("http://localhost:3000/DeleteProduct", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productID })
        });
        
        if (!res.ok) {
            throw new Error("Xóa không thành công.");
        }

        const result = await res.json();

        alert("Sản phẩm đã được xóa thành công!");

        // Chuyển hướng sau khi xóa
        window.location.href = "/Admin/TongThe/TongThe.html";
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
});
})();
});
