// backend/controllers/coffeeShopController.js
const pool = require('../config/db'); // Assuming your DB config is here

// Placeholder functions - we will implement these later

// Menu Management
exports.getAllMenus = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, price, category, description, availability FROM public.menu_items ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching menus:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.getMenuById = async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid menu ID provided.' });
    }
    try {
        const result = await pool.query('SELECT id, name, price, category, description, availability FROM public.menu_items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Error fetching menu with ID ${id}:`, err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.createMenu = async (req, res) => {
    const { name, price, category, description, availability = 'available' } = req.body; // Default availability

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Menu item name is required and must be a non-empty string.' });
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        return res.status(400).json({ message: 'Menu item price is required and must be a non-negative number.' });
    }
    if (category && typeof category !== 'string') {
        return res.status(400).json({ message: 'Category must be a string.' });
    }
     if (description && typeof description !== 'string') {
        return res.status(400).json({ message: 'Description must be a string.' });
    }
    if (!['available', 'unavailable'].includes(availability)) {
         return res.status(400).json({ message: 'Availability must be either "available" or "unavailable".' });
    }

    try {
        const query = `
            INSERT INTO public.menu_items (name, price, category, description, availability)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, price, category, description, availability;
        `;
        const values = [name.trim(), parseFloat(price), category, description, availability];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Menu item created successfully', menuItem: result.rows[0] });
    } catch (err) {
        console.error('Error creating menu item:', err);
        // Consider checking for specific DB errors like unique constraints if needed
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description, availability } = req.body;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid menu ID provided.' });
    }

    // Build the update query dynamically based on provided fields
    const fieldsToUpdate = [];
    const values = [];
    let queryIndex = 1;

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
             return res.status(400).json({ message: 'Menu item name must be a non-empty string.' });
        }
        fieldsToUpdate.push(`name = $${queryIndex++}`);
        values.push(name.trim());
    }
    if (price !== undefined) {
         if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return res.status(400).json({ message: 'Menu item price must be a non-negative number.' });
        }
        fieldsToUpdate.push(`price = $${queryIndex++}`);
        values.push(parseFloat(price));
    }
    if (category !== undefined) {
        // Allow null or string for category
        if (category !== null && typeof category !== 'string') {
             return res.status(400).json({ message: 'Category must be a string or null.' });
        }
        fieldsToUpdate.push(`category = $${queryIndex++}`);
        values.push(category);
    }
    if (description !== undefined) {
         // Allow null or string for description
        if (description !== null && typeof description !== 'string') {
             return res.status(400).json({ message: 'Description must be a string or null.' });
        }
        fieldsToUpdate.push(`description = $${queryIndex++}`);
        values.push(description);
    }
     if (availability !== undefined) {
        if (!['available', 'unavailable'].includes(availability)) {
            return res.status(400).json({ message: 'Availability must be either "available" or "unavailable".' });
        }
        fieldsToUpdate.push(`availability = $${queryIndex++}`);
        values.push(availability);
    }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    values.push(id); // Add the ID for the WHERE clause

    const query = `
        UPDATE public.menu_items
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = $${queryIndex}
        RETURNING id, name, price, category, description, availability;
    `;

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found or no changes made' });
        }

        res.status(200).json({ message: 'Menu item updated successfully', menuItem: result.rows[0] });
    } catch (err) {
        console.error(`Error updating menu item with ID ${id}:`, err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.deleteMenu = async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid menu ID provided.' });
    }

    try {
        // Optional: Check if the menu item exists first (or rely on rowCount)
        // const checkResult = await pool.query('SELECT id FROM public.menu_items WHERE id = $1', [id]);
        // if (checkResult.rows.length === 0) {
        //     return res.status(404).json({ message: 'Menu item not found' });
        // }

        const query = 'DELETE FROM public.menu_items WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            // This means the ID existed but wasn't deleted (or didn't exist)
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Send 204 No Content for successful deletion as there's no body to return
        res.status(204).send();

    } catch (err) {
        console.error(`Error deleting menu item with ID ${id}:`, err);
        // Check for foreign key constraint errors if menu items are linked to orders etc.
        if (err.code === '23503') { // PostgreSQL foreign key violation code
             return res.status(409).json({ message: 'Cannot delete menu item: It is referenced in existing orders or carts.', error: err.message });
        }
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

// Order Management
exports.createOrder = async (req, res) => {
    const { items, paymentMethod } = req.body;
    const userId = req.user.id; // Assuming authenticateToken middleware adds user info to req

    // --- Input Validation ---
    if (!userId) {
        return res.status(401).json({ message: 'User ID not found. Authentication required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Order items must be a non-empty array.' });
    }
    if (!paymentMethod || !['Cash', 'QRIS'].includes(paymentMethod)) {
        return res.status(400).json({ message: 'Invalid or missing payment method. Must be "Cash" or "QRIS".' });
    }

    let invalidItem = false;
    items.forEach(item => {
        if (!item.menuItemId || isNaN(parseInt(item.menuItemId)) || !item.quantity || isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0) {
            invalidItem = true;
        }
    });
    if (invalidItem) {
        return res.status(400).json({ message: 'Each order item must have a valid menuItemId and a positive integer quantity.' });
    }
    // --- End Validation ---


    const client = await pool.connect(); // Get a client connection for transaction

    try {
        await client.query('BEGIN'); // Start transaction

        // 1. Fetch item details and calculate total price
        const itemIds = items.map(item => item.menuItemId);
        const placeholders = itemIds.map((_, i) => `$${i + 1}`).join(','); // $1, $2, $3...
        const menuItemsResult = await client.query(`SELECT id, price, availability FROM public.menu_items WHERE id IN (${placeholders})`, itemIds);

        if (menuItemsResult.rows.length !== itemIds.length) {
             await client.query('ROLLBACK');
             return res.status(404).json({ message: 'One or more menu items not found.' });
        }

        let calculatedTotalPrice = 0;
        const orderItemsData = [];

        for (const item of items) {
            const menuItem = menuItemsResult.rows.find(dbItem => dbItem.id === parseInt(item.menuItemId));
            if (!menuItem) { // Should be caught by the length check above, but double-check
                 await client.query('ROLLBACK');
                 return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found.` });
            }
             if (menuItem.availability !== 'available') {
                 await client.query('ROLLBACK');
                 return res.status(400).json({ message: `Menu item "${menuItem.name || item.menuItemId}" is currently unavailable.` });
            }

            const itemTotalPrice = parseFloat(menuItem.price) * parseInt(item.quantity);
            calculatedTotalPrice += itemTotalPrice;
            orderItemsData.push({
                menuItemId: parseInt(item.menuItemId),
                quantity: parseInt(item.quantity),
                totalPrice: itemTotalPrice
            });
        }

        // 2. Insert into orders table
        const orderQuery = `
            INSERT INTO public.orders (user_id, total_price, status)
            VALUES ($1, $2, $3)
            RETURNING id, created_at;
        `;
        // Assuming order is immediately completed upon creation in a POS context
        const orderResult = await client.query(orderQuery, [userId, calculatedTotalPrice, 'completed']);
        const newOrderId = orderResult.rows[0].id;
        const orderCreatedAt = orderResult.rows[0].created_at;


        // 3. Insert into order_items table
        const orderItemInsertPromises = orderItemsData.map(item => {
            const itemQuery = `
                INSERT INTO public.order_items (order_id, menu_item_id, quantity, total_price)
                VALUES ($1, $2, $3, $4);
            `;
            return client.query(itemQuery, [newOrderId, item.menuItemId, item.quantity, item.totalPrice]);
        });
        await Promise.all(orderItemInsertPromises); // Execute all item insertions


        // 4. Insert into transactions table
        const transactionQuery = `
            INSERT INTO public.transactions (type, amount, description, category, payment_method, created_by)
            VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const transactionDescription = `Coffee Shop Order #${newOrderId}`;
        await client.query(transactionQuery, ['income', calculatedTotalPrice, transactionDescription, 'Coffee Shop Sale', paymentMethod, userId]);


        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: newOrderId,
                userId: userId,
                totalPrice: calculatedTotalPrice,
                status: 'completed',
                paymentMethod: paymentMethod, // Include payment method in response
                createdAt: orderCreatedAt,
                items: orderItemsData // Include processed items in response
            }
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on any error
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Internal Server Error during order creation', error: err.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID for potential ownership check if needed

     if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid order ID provided.' });
    }

    try {
        // Query to get the main order details
        const orderQuery = `
            SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, u.username as created_by_username
            FROM public.orders o
            JOIN public.users u ON o.user_id = u.id
            WHERE o.id = $1;
        `;
        const orderResult = await pool.query(orderQuery, [id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderDetails = orderResult.rows[0];

        // Optional: Add role-based access control if only admins/superadmins or the user who created it can view
        // if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && orderDetails.user_id !== userId) {
        //     return res.status(403).json({ message: 'Forbidden: You do not have permission to view this order.' });
        // }


        // Query to get the items associated with the order
        const itemsQuery = `
            SELECT oi.id as order_item_id, oi.menu_item_id, oi.quantity, oi.total_price as item_total_price,
                   mi.name as menu_item_name, mi.price as menu_item_unit_price
            FROM public.order_items oi
            JOIN public.menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = $1
            ORDER BY mi.name ASC;
        `;
        const itemsResult = await pool.query(itemsQuery, [id]);

        // Combine order details with items
        const fullOrder = {
            ...orderDetails,
            items: itemsResult.rows
        };

        // Fetch payment method from the related transaction
        // This assumes a direct link or identifiable description. Adjust if logic differs.
        const transactionQuery = `
            SELECT payment_method FROM public.transactions
            WHERE description = $1 AND type = 'income' AND amount = $2
            ORDER BY created_at DESC LIMIT 1;
        `;
         const transactionDescription = `Coffee Shop Order #${id}`;
        const transactionResult = await pool.query(transactionQuery, [transactionDescription, orderDetails.total_price]);

        if (transactionResult.rows.length > 0) {
            fullOrder.paymentMethod = transactionResult.rows[0].payment_method;
        } else {
             fullOrder.paymentMethod = 'Unknown'; // Or null, if preferred
             console.warn(`Could not find matching transaction for order ID ${id} to determine payment method.`);
        }


        res.status(200).json(fullOrder);

    } catch (err) {
        console.error(`Error fetching order with ID ${id}:`, err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    // Optional: Add pagination later if needed (e.g., using query parameters like ?page=1&limit=20)
    try {
        const query = `
            SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, u.username as created_by_username
            FROM public.orders o
            JOIN public.users u ON o.user_id = u.id
            ORDER BY o.created_at DESC;
        `;
        // Note: This fetches ALL orders. For large datasets, pagination is recommended.
        const result = await pool.query(query);

        // Fetch payment methods for all orders (can be inefficient for many orders)
        // Consider optimizing this if performance becomes an issue
        const ordersWithPayment = await Promise.all(result.rows.map(async (order) => {
            const transactionQuery = `
                SELECT payment_method FROM public.transactions
                WHERE description = $1 AND type = 'income' AND amount = $2
                ORDER BY created_at DESC LIMIT 1;
            `;
            const transactionDescription = `Coffee Shop Order #${order.id}`;
            const transactionResult = await pool.query(transactionQuery, [transactionDescription, order.total_price]);
            return {
                ...order,
                paymentMethod: transactionResult.rows.length > 0 ? transactionResult.rows[0].payment_method : 'Unknown'
            };
        }));


        res.status(200).json(ordersWithPayment);
    } catch (err) {
        console.error('Error fetching all orders:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

// Receipt Generation (might be part of getOrderById or a separate endpoint)
exports.printReceipt = async (req, res) => {
    // This function essentially provides the data needed for a receipt.
    // It reuses the logic from getOrderById.
    const { id } = req.params;
    const userId = req.user.id; // Get user ID for potential ownership check if needed

     if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid order ID provided for receipt.' });
    }

    try {
        // Query to get the main order details
        const orderQuery = `
            SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, u.username as created_by_username
            FROM public.orders o
            JOIN public.users u ON o.user_id = u.id
            WHERE o.id = $1;
        `;
        const orderResult = await pool.query(orderQuery, [id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found for receipt generation' });
        }

        const orderDetails = orderResult.rows[0];

        // Optional: Role-based access control
        // if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && orderDetails.user_id !== userId) {
        //     return res.status(403).json({ message: 'Forbidden: You do not have permission to view this receipt.' });
        // }

        // Query to get the items associated with the order
        const itemsQuery = `
            SELECT oi.id as order_item_id, oi.menu_item_id, oi.quantity, oi.total_price as item_total_price,
                   mi.name as menu_item_name, mi.price as menu_item_unit_price
            FROM public.order_items oi
            JOIN public.menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = $1
            ORDER BY mi.name ASC;
        `;
        const itemsResult = await pool.query(itemsQuery, [id]);

        // Combine order details with items
        const receiptData = {
            ...orderDetails,
            items: itemsResult.rows
        };

         // Fetch payment method from the related transaction
        const transactionQuery = `
            SELECT payment_method FROM public.transactions
            WHERE description = $1 AND type = 'income' AND amount = $2
            ORDER BY created_at DESC LIMIT 1;
        `;
         const transactionDescription = `Coffee Shop Order #${id}`;
        const transactionResult = await pool.query(transactionQuery, [transactionDescription, orderDetails.total_price]);

        if (transactionResult.rows.length > 0) {
            receiptData.paymentMethod = transactionResult.rows[0].payment_method;
        } else {
             receiptData.paymentMethod = 'Unknown';
             console.warn(`Could not find matching transaction for order ID ${id} to determine payment method for receipt.`);
        }

        // You could add more receipt-specific formatting here if needed,
        // like shop name, address, tax info etc., fetched from a config or another table.
        // For now, we return the detailed order data.
        res.status(200).json(receiptData);

    } catch (err) {
        console.error(`Error generating receipt data for order ID ${id}:`, err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};
