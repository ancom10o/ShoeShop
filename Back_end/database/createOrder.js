const sql = require("mssql");

const createOrder = async (req, res) => {
    try {
        const { user_id, products, total_price, ship_info } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!user_id || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu đơn hàng không hợp lệ"
            });
        }

        const pool = global.pool;
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // Tạo đơn hàng mới
            const orderResult = await new sql.Request(transaction)
                .input('user_id', sql.Int, user_id)
                .input('total_price', sql.Decimal(10,2), total_price)
                .input('ship_info', sql.NVarChar, ship_info)
                .input('status', sql.VarChar, 'Pending')
                .query(`
                    INSERT INTO [Order] (User_ID, Total_Price, Ship_info, Status, Order_date)
                    OUTPUT INSERTED.Order_ID
                    VALUES (@user_id, @total_price, @ship_info, @status, GETDATE())
                `);

            const orderId = orderResult.recordset[0].Order_ID;

            // Thêm các sản phẩm vào đơn hàng
            for (const item of products) {
                await new sql.Request(transaction)
                    .input('order_id', sql.Int, orderId)
                    .input('variant_id', sql.Int, item.variant_id)
                    .input('quantity', sql.Int, item.quantity)
                    .input('unit_price', sql.Decimal(10,2), item.unit_price)
                    .query(`
                        INSERT INTO [OrderItem] (Order_ID, Variant_ID, Quantity, Unit_price)
                        VALUES (@order_id, @variant_id, @quantity, @unit_price)
                    `);
            }

            await transaction.commit();

            return res.status(201).json({
                success: true,
                message: "Đặt hàng thành công",
                data: {
                    order_id: orderId
                }
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error("Lỗi createOrder:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo đơn hàng",
            error: err.message
        });
    }
};

module.exports = createOrder;