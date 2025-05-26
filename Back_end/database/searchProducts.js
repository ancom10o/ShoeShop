const sql = require("mssql");

const searchProducts = async (req, res) => {
    try {
        const { searchTerm, category, brand, gender, minPrice, maxPrice } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        // Validate search term
        if (!searchTerm && !category && !brand && !gender) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập ít nhất một điều kiện tìm kiếm"
            });
        }

        const pool = global.pool;

        // Build dynamic WHERE clause
        let whereClause = [];
        let params = new sql.Request(pool);

        if (searchTerm) {
            whereClause.push("p.Name LIKE @searchTerm");
            params.input('searchTerm', sql.NVarChar, `%${searchTerm}%`);
        }
        if (category) {
            whereClause.push("p.Category = @category");
            params.input('category', sql.NVarChar, category);
        }
        if (brand) {
            whereClause.push("p.Brand = @brand");
            params.input('brand', sql.NVarChar, brand);
        }
        if (gender) {
            whereClause.push("p.Gender = @gender");
            params.input('gender', sql.NVarChar, gender);
        }
        if (minPrice) {
            whereClause.push("p.UnitPrice >= @minPrice");
            params.input('minPrice', sql.Decimal(10,2), minPrice);
        }
        if (maxPrice) {
            whereClause.push("p.UnitPrice <= @maxPrice");
            params.input('maxPrice', sql.Decimal(10,2), maxPrice);
        }

        const whereString = whereClause.length > 0 ? 
            `WHERE ${whereClause.join(" AND ")}` : "";

        // Count total matching products
        const countResult = await params
            .query(`
                SELECT COUNT(DISTINCT p.Product_ID) as total
                FROM Product p
                ${whereString}
            `);

        const totalProducts = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        // Get paginated results
        params.input('offset', sql.Int, offset);
        params.input('limit', sql.Int, limit);

        const result = await params.query(`
            SELECT 
                p.Product_ID,
                p.Name,
                p.Category,
                p.Brand,
                p.Gender,
                p.UnitPrice,
                p.Discount,
                p.Images,
                (
                    SELECT SUM(v.Stock)
                    FROM Variant v
                    WHERE v.Product_ID = p.Product_ID
                ) as TotalStock,
                (
                    SELECT STRING_AGG(v.Size, ', ')
                    FROM (SELECT DISTINCT Size FROM Variant WHERE Product_ID = p.Product_ID) v
                ) as AvailableSizes,
                (
                    SELECT STRING_AGG(v.Color, ', ')
                    FROM (SELECT DISTINCT Color FROM Variant WHERE Product_ID = p.Product_ID) v
                ) as AvailableColors
            FROM Product p
            ${whereString}
            ORDER BY p.Product_ID
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

        return res.status(200).json({
            success: true,
            message: "Tìm kiếm thành công",
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
        console.error("Lỗi searchProducts:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tìm kiếm sản phẩm",
            error: err.message
        });
    }
};

module.exports = searchProducts;