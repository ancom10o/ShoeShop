const sql = require("mssql");

const AddProduct = async (req, res) => {
    try {
        const {
            Name,
            Category,
            Brand,
            Gender,
            UnitPrice,
            Discount,
            Stock,
            Color,
            Size,
            Images
        } = req.body;

        const pool = global.pool;

       
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            
            const request1 = new sql.Request(transaction);
            const result1 = await request1
                .input("Name", sql.NVarChar, Name)
                .input("Category", sql.NVarChar, Category)
                .input("Brand", sql.NVarChar, Brand)
                .input("Gender", sql.NVarChar, Gender)
                .input("UnitPrice", sql.Float, UnitPrice)
                .input("Discount", sql.Float, Discount)
                .input("Images", sql.NVarChar, Images)
                .query(`
                    INSERT INTO Product (Name, Category, Brand, Gender, UnitPrice, Discount, Images)
                    OUTPUT INSERTED.Product_ID
                    VALUES (@Name, @Category, @Brand, @Gender, @UnitPrice, @Discount, @Images)
                `);

            const newProductID = result1.recordset[0].Product_ID;

         
            const request2 = new sql.Request(transaction);
            await request2
                .input("Product_ID", sql.Int, newProductID)
                .input("Color", sql.NVarChar, Color)
                .input("Size", sql.NVarChar, Size)
                .input("Stock", sql.Int, Stock)
                .query(`
                    INSERT INTO Variant (Product_ID, Color, Size, Stock)
                    VALUES (@Product_ID, @Color, @Size, @Stock)
                `);

           
            await transaction.commit();

            res.status(201).json({ message: "Thêm sản phẩm thành công", Product_ID: newProductID });
        } catch (innerErr) {
            await transaction.rollback();
            console.error("Lỗi khi thêm sản phẩm (giao dịch):", innerErr);
            res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
        }
    } catch (err) {
        console.error("Lỗi server khi thêm sản phẩm:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
};

module.exports = AddProduct;
