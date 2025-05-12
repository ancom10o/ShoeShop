document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addProductBtn")
    .addEventListener("click", async () => {
      const Name = document.getElementById("productName").value.trim();
      const Category = document.getElementById("productCategory").value;
      const Brand = document.getElementById("productBrand").value;
      const Gender = document.getElementById("productGender").value;
      const UnitPrice = parseFloat(
        document.getElementById("productPrice").value
      );
      const Discount =
        parseFloat(document.getElementById("productDiscount").value) / 100;
      const Stock = parseInt(document.getElementById("productQuantity").value);
      const Color = document.getElementById("productColor").value.trim();
      const Size = document.getElementById("productSize").value.trim();

      const imageElement = document.querySelector("#imageContainer img");
      const Images = imageElement ? imageElement.src : "";

      if (
        !Name ||
        isNaN(UnitPrice) ||
        UnitPrice <= 0 ||
        isNaN(Discount) ||
        Discount < 0 ||
        Discount >= 1 ||
        isNaN(Stock) ||
        Stock < 0
      ) {
        alert("Vui lòng điền đầy đủ và đúng định dạng các trường dữ liệu!");
        return;
      }

      const newProduct = {
        Name,
        Category,
        Brand,
        Gender,
        UnitPrice,
        Discount,
        Stock,
        Color,
        Size,
        Images,
      };

      try {
        const res = await fetch("http://localhost:3000/AddProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        const result = await res.json();
        if (res.ok) {
          alert("Thêm sản phẩm thành công!");
        } else {
          alert(result.error || "Đã xảy ra lỗi khi thêm sản phẩm.");
        }
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Đã xảy ra lỗi server.");
      }
    });
});
