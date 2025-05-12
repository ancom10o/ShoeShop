const sql = require("mssql");

const DeleteProduct = async (req, res) => {
    try {
        const { productID } = req.body;
      
        if (!productID) {
            return res.status(400).json({ error: "Thiếu productID" });
        }

        const pool = global.pool;

        
        await pool.request()
            .input("productID", sql.Int, productID)
            .query(`DELETE FROM Variant WHERE Product_ID = @productID`);

       
        const result = await pool.request()
            .input("productID", sql.Int, productID)
            .query(`DELETE FROM Product WHERE Product_ID = @productID`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm để xóa" });
        }

        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi xóa sản phẩm." });
    }
};

module.exports = DeleteProduct;
