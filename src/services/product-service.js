const ProductRepository = require("../database/repository/product-repository");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productData) {
    try {
      const product = await this.repository.CreateProduct(productData);
      return FormateData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();
      return FormateData(products);
    } catch (error) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductById(id) {
    try {
      const product = await this.repository.FindById(id);
      return FormateData(product);
    } catch (error) {
      throw new APIError("Data Not found");
    }
  }
}

module.exports = ProductService;
