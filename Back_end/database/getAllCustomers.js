const sql = require("mssql");

const getAllCustomers = async (req, res) => {
    try {
        // Get pagination params from both query and body
        const page = parseInt(req.query.page || req.body.page) || 1;
        const limit = parseInt(req.query.limit || req.body.limit) || 10;
        const offset = (page - 1) * limit;

        const pool = global.pool;

        // Get total count
        const countResult = await pool.request()
            .query(`
                SELECT COUNT(*) as total
                FROM [User]
                WHERE Role = 'customer'
            `);
        
        const totalCustomers = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalCustomers / limit);

        // Get paginated customers - removed Address field
        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
                SELECT 
                    User_ID,
                    Username,
                    Phone,
                    Role,
                    Create_date
                FROM [User]
                WHERE Role = 'customer'
                ORDER BY User_ID ASC 
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `);

        // Format response
        return res.status(200).json({
            success: true,
            message: "Lấy danh sách khách hàng thành công",
            data: {
                customers: result.recordset.map(customer => ({
                    ...customer,
                    Create_date: customer.Create_date?.toISOString()
                })),
                pagination: {
                    total: totalCustomers,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit
                }
            }
        });

    } catch (err) {
        console.error("Lỗi getAllCustomers:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách khách hàng",
            error: err.message
        });
    }
};

module.exports = getAllCustomers;