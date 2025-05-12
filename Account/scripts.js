
// Nạp header
fetch("../header.html")
    .then(response => response.text())
    .then(data => document.querySelector(".header").innerHTML = data);

// Nạp footer
fetch("../footer.html")
    .then(response => response.text())
    .then(data => document.querySelector(".footer").innerHTML = data);


// Regex
const regexPhone = /^0\d{9}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
const regexUsername = /^[a-zA-Z0-9]{4,}$/;


const usernameInput = document.querySelector('#username');
const phoneInput = document.querySelector('#phone');
const passwordInput = document.querySelector('#password');
const repasswordInput = document.querySelector('#repassword');




const usernameError = document.querySelector('.e_username');
const phoneError = document.querySelector('.e_phone');
const passwordError = document.querySelector('.e_password');
const repasswordError = document.querySelector('.e_repassword');


const errorStyle = (tag) => {
    tag.style.borderColor = 'red';
    tag.style.boxShadow = '0 0 5px red';
};

const successStyle = (tag) => {
    tag.style.borderColor = 'green';
    tag.style.boxShadow = '0 0 5px green';
};

const contentError = (tag, err) => {
    tag.textContent = err;
};

// Check functions
async function checkUsername() {
    const val = usernameInput.value.trim();
    console.log('name', val);
    if (val.length === 0) {
        errorStyle(usernameInput);
        contentError(usernameError, 'Tài khoản không được để trống!');
        return false;
    }

    if (!regexUsername.test(val)) {
        errorStyle(usernameInput);
        contentError(usernameError, 'Tài khoản phải >= 4 ký tự, không dấu, không khoảng trắng!');
        return false;
    }

    if (val.includes(' ')) {
        errorStyle(usernameInput);
        contentError(usernameError, 'Không được chứa khoảng trắng!');
        return false;
    }

    const res = await fetch('http://localhost:3000/checkAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: 'Username', account: val })
    });

    if (res.status === 404) {
        errorStyle(usernameInput);
        contentError(usernameError, 'Tài khoản đã tồn tại!');
        return false;
    }

    successStyle(usernameInput);
    contentError(usernameError, '');
    return true;
}

async function checkPhone() {

    const val = phoneInput.value.trim();
    console.log('phone', val);
    if (!regexPhone.test(val)) {
        errorStyle(phoneInput);
        contentError(phoneError, 'Số điện thoại không hợp lệ!');
        return false;
    }

    const res = await fetch('http://localhost:3000/checkAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType: 'Phone', account: val })
    });

    if (res.status === 404) {
        errorStyle(phoneInput);
        contentError(phoneError, 'Số điện thoại đã được sử dụng!');
        return false;
    }

    successStyle(phoneInput);
    contentError(phoneError, '');
    return true;
}

async function checkPassword() {
    const pass = passwordInput.value;
    const rePass = repasswordInput.value;
    console.log('pass', pass);
    if (!regexPassword.test(pass)) {
        errorStyle(passwordInput);
        contentError(passwordError, 'Mật khẩu phải >= 6 ký tự, chứa cả số và chữ!');
        return false;
    }

    if (pass.includes(' ')) {
        errorStyle(passwordInput);
        contentError(passwordError, 'Không được chứa khoảng trắng!');
        return false;
    }

    successStyle(passwordInput);
    contentError(passwordError, '');

    if (pass !== rePass) {
        errorStyle(repasswordInput);
        contentError(repasswordError, 'Mật khẩu nhập lại không khớp!');
        return false;
    }

    successStyle(repasswordInput);
    contentError(repasswordError, '');
    return true;
}

// Submit
async function checkSubmit() {
    const validUsername = await checkUsername();
    const validPhone = await checkPhone();
    const validPassword = await checkPassword();

    console.log(validUsername.value, validPhone.value, validPassword.value);

    if (validUsername && validPhone && validPassword) {
        // Gửi request đăng ký
        await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value,
                phone: phoneInput.value
            })
        });

        alert("Đăng ký thành công!");
        window.location.href = '/Account/login.html';
    }
}

// Bind button
document.getElementById('register-button').addEventListener('click', async (e) => {
    e.preventDefault();
    await checkSubmit();
    console.log("Đã click");
});
