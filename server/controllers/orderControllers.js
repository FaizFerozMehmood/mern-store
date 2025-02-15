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
      return sendResponse(res, 401, null, true, "unauthorized!");
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
    console.log("error===  >" ,error);
    
    return sendResponse(res, 500, null, true, "Internal server errror!");
  }
};
