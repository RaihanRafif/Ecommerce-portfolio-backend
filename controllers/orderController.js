const { Cart, CartItem, Order, OrderItem, ProductSpecific, sequelize } = require('../models');

// Create a new order from the cart
exports.createOrderFromCart = async (req, res) => {
    const t = await sequelize.transaction(); // Start a transaction

    try {
        const userId = req.user.id;

        // Step 1: Retrieve the user's cart and its items
        const cart = await Cart.findOne({
            where: { userId },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Step 2: Calculate the total amount for the order
        const totalAmount = await Promise.all(cartItems.map(async item => {
            const product = await ProductSpecific.findByPk(item.specificProductId);
            return item.totalProduct * (product ? product.price : 0);
        }));

        const orderTotalAmount = totalAmount.reduce((acc, amount) => acc + amount, 0);

        // Step 3: Create a new order
        const order = await Order.create({
            userId,
            totalAmount: orderTotalAmount,
            orderStatus: 'pending',  // You can customize this based on your logic
            paymentStatus: 'pending', // Default payment status
        }, { transaction: t });

        // Step 4: Create order items from cart items
        const orderItemsData = cartItems.map(item => ({
            orderId: order.id,
            productSpecificId: item.specificProductId,
            quantity: item.totalProduct,
            price: item.price,  // Assuming `CartItem` model has `price` attribute
        }));

        await OrderItem.bulkCreate(orderItemsData, { transaction: t });

        // Step 5: Clear the cart items
        await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

        // Commit the transaction
        await t.commit();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        // Rollback the transaction in case of error
        await t.rollback();
        console.error('Error creating order from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all orders for a specific user
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find orders for the user
        const orders = await Order.findAll({
            where: { userId },
        });

        // Retrieve order items for each order
        const ordersWithItems = await Promise.all(orders.map(async order => {
            const items = await OrderItem.findAll({
                where: { orderId: order.id },
            });
            return { ...order.toJSON(), orderItems: items };
        }));

        res.status(200).json(ordersWithItems);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update an order's status or payment status
exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        // Find the order
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order's status
        order.orderStatus = orderStatus || order.orderStatus;
        order.paymentStatus = paymentStatus || order.paymentStatus;
        await order.save();

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete an order and its items
exports.deleteOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { orderId } = req.params;

        // Find the order
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Delete order items
        await OrderItem.destroy({ where: { orderId } }, { transaction: t });

        // Delete the order
        await Order.destroy({ where: { id: orderId } }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
