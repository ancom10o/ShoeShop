const sql = require("mssql");

const getOrderList = async (req, res) => {
    try {
        const page = parseInt(req.query.page || req.body.page) || 1;
        const limit = parseInt(req.query.limit || req.body.limit) || 10;
        const offset = (page - 1) * limit;

        const pool = global.pool;

        // Get total count
        const countResult = await pool.request()
            .query(`SELECT COUNT(*) as total FROM [Order]`);
        
        const totalOrders = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalOrders / limit);

        // Get orders with detailed information
        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
                WITH PaginatedOrders AS (
                    SELECT 
                        o.Order_ID,
                        o.User_ID,
                        u.Username,
                        u.Phone,
                        o.Order_date,
                        o.Status,
                        o.Total_Price,
                        o.Ship_info
                    FROM [Order] o
                    LEFT JOIN [User] u ON o.User_ID = u.User_ID
                    ORDER BY o.Order_ID DESC
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY
                )
                SELECT 
                    p.*,
                    (
                        SELECT COUNT(*) 
                        FROM [OrderItem] oi 
                        WHERE oi.Order_ID = p.Order_ID
                    ) as Total_Items,
                    (
                        SELECT STRING_AGG(
                            CONCAT(pr.Name, ' (', oi.Quantity, ' x ', oi.Unit_price, '₫)'),
                            ', '
                        )
                        FROM [OrderItem] oi
                        JOIN [Product] pr ON oi.Variant_ID = pr.Product_ID
                        WHERE oi.Order_ID = p.Order_ID
                        FOR XML PATH('')
                    ) as OrderDetails
                FROM PaginatedOrders p
            `);

        // Format response
        return res.status(200).json({
            success: true,
            message: "Lấy danh sách đơn hàng thành công",
            data: {
                orders: result.recordset.map(order => ({
                    orderId: order.Order_ID,
                    userId: order.User_ID,
                    customerInfo: {
                        username: order.Username,
                        phone: order.Phone
                    },
                    orderDate: order.Order_date?.toISOString(),
                    status: order.Status,
                    totalPrice: order.Total_Price,
                    shippingInfo: order.Ship_info,
                    orderSummary: {
                        totalItems: order.Total_Items,
                        details: order.OrderDetails?.replace(/&amp;/g, '&')
                    }
                })),
                pagination: {
                    total: totalOrders,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit
                }
            }
        });

    } catch (err) {
        console.error("Lỗi getOrderList:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: err.message
        });
    }
};

module.exports = getOrderList;