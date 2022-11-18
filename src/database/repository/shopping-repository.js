const { APIError, STATUS_CODES } = require("../../utils/app-error");
const { OrderModel, CustomerModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

class ShoppingRepository {
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId }).populate(
        "items.product"
      );
      return orders;
    } catch (error) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find orders"
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "cart.product"
      );
      if (profile) {
        let amount = 0;

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });

          profile.cart = [];

          order.populate("items.product").execPopulate();
          const orderResult = await order.save();

          profile.orders.push(orderResult);

          await profile.save();

          return orderResult;
        }
      }
      return {};
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }
}

module.exports = ShoppingRepository;
