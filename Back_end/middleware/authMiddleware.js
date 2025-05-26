const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/jwt.config');

// const JWT_SECRET = "ShoeShop@2025_SecretKey";

const verifyAdminToken = (req, res, next) => {
    try {
        // Kiểm tra header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Vui lòng đăng nhập để tiếp tục"
            });
        }

        // Lấy token từ header
        const token = authHeader.split(' ')[1];
        
        // Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Kiểm tra quyền admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện chức năng này"
            });
        }

        // Lưu thông tin user vào request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Phiên đăng nhập đã hết hạn"
            });
        }
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ"
        });
    }
};

module.exports = { verifyAdminToken };