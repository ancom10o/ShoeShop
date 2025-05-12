const sql = require("mssql");

const updateProduct = async (req, res) => {
    try {
        const {
            Product_ID,
            Name,
            Category,
            Brand,
            Gender,
            UnitPrice,
            Discount,
        
            Color,
            Size,
            Stock
        } = req.body;

        const pool = global.pool;

        // Update Product
        await pool.request()
            .input("Product_ID", sql.Int, Product_ID)
            .input("Name", sql.NVarChar, Name)
            .input("Category", sql.NVarChar, Category)
            .input("Brand", sql.NVarChar, Brand)
            .input("Gender", sql.NVarChar, Gender)
            .input("UnitPrice", sql.Float, UnitPrice)
            .input("Discount", sql.Float, Discount)
            
            .query(`
                UPDATE Product
                SET Name = @Name, Category = @Category, Brand = @Brand, Gender = @Gender,
                    UnitPrice = @UnitPrice, Discount = @Discount
                WHERE Product_ID = @Product_ID
            `);

        // Update Variant
        await pool.request()
            .input("Product_ID", sql.Int, Product_ID)
            .input("Color", sql.NVarChar, Color)
            .input("Size", sql.NVarChar, Size)
            .input("Stock", sql.Int, Stock)
            .query(`
                UPDATE Variant
                SET Color = @Color, Size = @Size, Stock = @Stock
                WHERE Product_ID = @Product_ID
            `);

        res.json({ message: "Cập nhật sản phẩm thành công" });
    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server khi cập nhật sản phẩm." });
    }
};

module.exports = updateProduct;
