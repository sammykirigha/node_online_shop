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
      let categories = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return FormateData({ products, categories: Object.keys(categories) });
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

  async GetProductByCategory(category) {
    try {
      const product = await this.repository.FindByCategory(category);
      return FormateData(product);
    } catch (error) {
      console.log(error);
      throw new APIError("Data Not found");
    }
  }

  async GetProductsBySelectedIds(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (error) {
      console.log(error);
      throw new APIError("Data Not found");
    }
  }
}

module.exports = ProductService;
