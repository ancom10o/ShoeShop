document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

console.log("dsdsdsds",token);

  if (token) {
    fetch("http://localhost:3000/getUSerInfo", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      
      .then((data) => {
        console.log("dsdsd",data);
        const username = data.username || data.name || "Người dùng";
        
        const userDropdown = document.getElementById("user-dropdown");
        if (userDropdown) {
          userDropdown.innerHTML = `
            <div class="dropdown">
              <button class="dropbtn">${username} <i class="fa fa-caret-down"></i></button>
              <div class="dropdown-content">
                <a href="#">Tài khoản</a>
                <a href="#" onclick="logout()">Đăng xuất</a>
              </div>
            </div>
          `;
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin user:", err);
      });
  }
});
