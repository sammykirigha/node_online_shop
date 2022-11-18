const { ProductModel } = require("../models");

class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    supplier,
    banner,
  }) {
    try {
      const product = new ProductModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product"
      );
    }
  }

  async Products() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product"
      );
    }
  }

  async FindById(id) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product"
      );
    }
  }
}

module.exports = ProductRepository;
