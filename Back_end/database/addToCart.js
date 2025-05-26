const sql = require("mssql");

const addToCart = async (req, res) => {
    try {
        const { user_id, variant_id, quantity } = req.body;

        // Validate input
        if (!user_id || !variant_id || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ"
            });
        }

        const pool = global.pool;

        // Check if product variant exists and has enough stock
        const variantCheck = await pool.request()
            .input('variant_id', sql.Int, variant_id)
            .query(`
                SELECT v.Stock, p.UnitPrice, p.Name, v.Size, v.Color, v.Product_ID
                FROM Variant v
                JOIN Product p ON v.Product_ID = p.Product_ID
                WHERE v.Variant_ID = @variant_id
            `);

        if (variantCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        const variant = variantCheck.recordset[0];
        
        if (variant.Stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Số lượng sản phẩm trong kho không đủ"
            });
        }

        // Check if user has an active cart
        let cartId;
        const cartCheck = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
                SELECT Cart_ID
                FROM Cart 
                WHERE User_ID = @user_id
            `);

        if (cartCheck.recordset.length === 0) {
            // Create new cart
            const newCart = await pool.request()
                .input('user_id', sql.Int, user_id)
                .input('total_price', sql.Decimal(10,2), 0)
                .query(`
                    INSERT INTO Cart (User_ID, Total_Price)
                    OUTPUT INSERTED.Cart_ID
                    VALUES (@user_id, @total_price)
                `);
            cartId = newCart.recordset[0].Cart_ID;
        } else {
            cartId = cartCheck.recordset[0].Cart_ID;
        }

        // Check if item already exists in cart
        const cartItemCheck = await pool.request()
            .input('cart_id', sql.Int, cartId)
            .input('variant_id', sql.Int, variant_id)
            .query(`
                SELECT Cart_ID, Quantity 
                FROM CartItem 
                WHERE Cart_ID = @cart_id AND Variant_ID = @variant_id
            `);

        if (cartItemCheck.recordset.length > 0) {
            // Update existing cart item
            const newQuantity = cartItemCheck.recordset[0].Quantity + quantity;
            
            if (newQuantity > variant.Stock) {
                return res.status(400).json({
                    success: false,
                    message: "Số lượng vượt quá tồn kho"
                });
            }

            await pool.request()
                .input('cart_id', sql.Int, cartId)
                .input('variant_id', sql.Int, variant_id)
                .input('quantity', sql.Int, newQuantity)
                .input('unit_price', sql.Decimal(10,2), variant.UnitPrice)
                .query(`
                    UPDATE CartItem 
                    SET Quantity = @quantity,
                        Unit_price = @unit_price
                    WHERE Cart_ID = @cart_id AND Variant_ID = @variant_id
                `);
        } else {
            // Add new cart item
            await pool.request()
                .input('cart_id', sql.Int, cartId)
                .input('variant_id', sql.Int, variant_id)
                .input('quantity', sql.Int, quantity)
                .input('unit_price', sql.Decimal(10,2), variant.UnitPrice)
                .query(`
                    INSERT INTO CartItem (Cart_ID, Variant_ID, Quantity, Unit_price)
                    VALUES (@cart_id, @variant_id, @quantity, @unit_price)
                `);
        }

        // Update cart total price
        await pool.request()
            .input('cart_id', sql.Int, cartId)
            .query(`
                UPDATE Cart
                SET Total_Price = (
                    SELECT SUM(Quantity * Unit_price)
                    FROM CartItem
                    WHERE Cart_ID = @cart_id
                )
                WHERE Cart_ID = @cart_id
            `);

        return res.status(200).json({
            success: true,
            message: "Thêm vào giỏ hàng thành công",
            data: {
                cart_id: cartId,
                product_name: variant.Name,
                size: variant.Size,
                color: variant.Color,
                quantity: quantity,
                unit_price: variant.UnitPrice
            }
        });

    } catch (err) {
        console.error("Lỗi addToCart:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi thêm vào giỏ hàng",
            error: err.message
        });
    }
};

module.exports = addToCart;