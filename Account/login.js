document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");

  if (loginButton) {
    loginButton.addEventListener("click", login);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      login();
    }
  });
});

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
    return;
  }

  console.log("Attempting login with username:", username, "password:", password);

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log("Response:", response);
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    // Kiểm tra nếu response trả về là JSON hợp lệ
    let result;
    try {
      result = await response.json();
      console.log("Response JSON:", result);
    } catch (error) {
      console.error("Failed to parse JSON from server:", error);
      alert("Lỗi khi nhận dữ liệu từ server. Vui lòng thử lại sau.");
      return;
    }

    switch (response.status) {
      case 200:
        // Lưu thông tin vào localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.username);
        localStorage.setItem("role", result.role);
          
        console.log("Login successful for:", result.username);

        // Chuyển hướng người dùng dựa trên vai trò
        if (result.role === "admin") {
          window.location.href = "/Admin/TongThe/TongThe.html";
        } else if (result.role === "customer") {
          window.location.href = "/index.html";
        } else {
          alert("Vai trò không xác định.");
        }
        break;

      case 404:
        alert("Không tìm thấy tài khoản.");
        break;

      case 401:
        alert("Sai mật khẩu.");
        break;

      default:
        alert("Lỗi đăng nhập. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
    alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
  }
}


