async function getAllCustomers() {
    try {
        const res = await fetch('http://localhost:3000/getAllCustomers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error('Không thể lấy danh sách khách hàng:', res.status);
            return;
        }

        const data = await res.json();
    

        // Gán dữ liệu vào tbody, KHÔNG phải toàn bộ bảng
        const tbody = document.getElementById('customer-tbody');
        tbody.innerHTML = ""; // Xóa dữ liệu cũ

        data.forEach((customer, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${customer.Username || "Không rõ"}</td>
                <td>${customer.Phone || "Không rõ"}</td>
                <td>
                    <a href="../QuanLyTaiKhoan/ChiTietKhachHang.html?id=${customer.User_ID}">
                        <button class="detail-btn">Chi tiết</button>
                    </a>
                </td>
            `;
            console.log(customer.User_ID);
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khách hàng:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getAllCustomers();
});



 async function getCustomerById() {
    const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");
console.log("dsds",userId);
    if (!userId) {
     
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/getCustomerById/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error("Không thể lấy thông tin khách hàng:", res.status);
           
            return;
        }

        const customer = await res.json();
        console.log("Chi tiết khách hàng:", customer);

        // Gán dữ liệu vào trang
        const infoBox = document.querySelector(".info-box");
        infoBox.innerHTML = `
            <div><strong>Id:</strong> ${customer.User_ID || "Không rõ"}</div>
            <div><strong>User name:</strong> ${customer.Username || "Không rõ"}</div>
            <div><strong>Phone:</strong> ${customer.Phone || "Không rõ"}</div>
            <div><strong>Role:</strong> ${customer.Role || "Không rõ"}</div>
            <div><strong>Creation date:</strong> ${customer.Create_date ? new Date(customer.Create_date).toLocaleDateString("vi-VN") : "Không rõ"}</div>
        `;

    } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        alert("Không thể hiển thị thông tin khách hàng.");
    }
}

getCustomerById();


async function confirmDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        alert("Không tìm thấy ID khách hàng.");
        return;
    }

    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa khách hàng này?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`http://localhost:3000/deleteCustomer/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            alert("Xóa khách hàng thành công.");
            window.location.href = "/Admin/QuanLyTaiKhoan/TaiKhoan.html"; 
        } else {
            const data = await res.json();
            alert("lỗi");
        }
    } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
        alert("Đã xảy ra lỗi khi xóa khách hàng.");
    }
}
confirmDelete