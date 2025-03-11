import sendResponse from "../helpers/sendResponse.js";
import Order from "../models/ordersModel.js";

export const CreateOrder = async (req, res) => {
  try {
    const { orderItems, orderDeliveryAddress, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return sendResponse(
        res,
        400,
        null,
        true,
        "No items in your order found!"
      );
    }
    if (!orderDeliveryAddress) {
      return sendResponse(
        res,
        400,
        null,
        true,
        "Delivery address is actually required !"
      );
    }
    if (!totalPrice || totalPrice <= 0) {
      return sendResponse(res, 400, null, true, "invalid total price");
    }
    if (!req.user || !req.user._id) {
      return sendResponse(res, 401, null, true, "unauthorized!,no user found!");
    }
    const order = new Order({
      user: req.user._id,
      orderItems,
      orderDeliveryAddress,
      totalPrice,
    });
    await order.save();
    sendResponse(res, 201, order, false, "Order placed successfully!");
  } catch (error) {
    console.log("error===  >", error);

    return sendResponse(res, 500, null, true, "Internal server errror!");
  }
};

export const getOrders = async (req, res) => {
  try {
    
    const { _id } = req.params;
    console.log(_id);
    if (_id) {
      const orders = await Order.findById(_id).populate("user", "name email");
      if (!orders) {
        return sendResponse(res, 404, null, true, "No Orders found!");
      }
      return sendResponse(
        res,
        200,
        orders,
        false,
        "Order fetched Successfully!"
      );
    } else {
      const orders = await Order.find().populate("user", "name email");
      if (!orders.length) {
        return sendResponse(res, 404, null, true, "No Orders found!");
      }
      return sendResponse(
        res,
        200,
        orders,
        false,
        "Orders fetched successfully!"
      );
    }
  } catch (error) {
    console.log("error fetching orders", error);
    return sendResponse(res, 500, null, true, "internal server error!");
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    // console.log("status===================>",req.body.status);
    
    const { id } = req.params;
    const { status } = req.body;
    const ValidSatus = ["Pending", "On The Way", "Delivered", "Cancelled"];
    if (!ValidSatus.includes(status)) {
      return sendResponse(res, 400, null, true, "invalid status!");
    }
    const order = await Order.findById(id);
    if (!order) {
      return sendResponse(res, 404, null, true, "Order not found!");
    }
    order.orderStatus = status;
    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }
    await order.save();
    console.log("Updated Order:", order);
    sendResponse(res, 200, order, false, "status updated!");
  } catch (error) {
    console.log("error updating order status!", error);
    return sendResponse(res, 500, null, true, "internal server error!");
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; 
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return sendResponse(res, 404, null, true, "No orders found!");
    }

    sendResponse(res, 200, orders, false, "Orders retrieved successfully.");
  } catch (error) {
    console.error("Error fetching user orders:", error);
    sendResponse(res, 500, null, true, "Internal Server Error.");
  }
};
