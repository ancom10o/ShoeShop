const sql = require("mssql");

const getProductListAll = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 12;
        const offset = (page - 1) * limit;

        const pool = global.pool;

        // Đếm tổng số sản phẩm (không trùng lặp)
        const countResult = await pool.request()
            .query(`
                SELECT COUNT(*) as total
                FROM Product
            `);
        
        const totalProducts = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        // Lấy sản phẩm theo phân trang với CTE
        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
                WITH PaginatedProducts AS (
                    SELECT Product_ID, Name, Category, Brand, Gender, UnitPrice, Discount, Images
                    FROM Product
                    ORDER BY Product_ID
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY
                )
                SELECT 
                    p.*,
                    (
                        SELECT SUM(Stock) 
                        FROM Variant 
                        WHERE Product_ID = p.Product_ID
                    ) as TotalStock,
                    (
                        SELECT STRING_AGG(Color, ', ') 
                        FROM (SELECT DISTINCT Color FROM Variant WHERE Product_ID = p.Product_ID) AS Colors
                    ) as Colors,
                    (
                        SELECT STRING_AGG(Size, ', ') 
                        FROM (SELECT DISTINCT Size FROM Variant WHERE Product_ID = p.Product_ID) AS Sizes
                    ) as Sizes
                FROM PaginatedProducts p
            `);

        // Kiểm tra kết quả trống
        if (result.recordset.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Không có sản phẩm nào",
                data: {
                    products: [],
                    pagination: {
                        total: totalProducts,
                        currentPage: page,
                        totalPages: totalPages,
                        limit: limit
                    }
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách sản phẩm thành công",
            data: {
                products: result.recordset,
                pagination: {
                    total: totalProducts,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit
                }
            }
        });

    } catch (err) {
        console.error("Lỗi getProductListAll:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm",
            error: err.message
        });
    }
};

module.exports = getProductListAll;