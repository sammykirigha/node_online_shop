const { product } = require("../services");
const ProductService = require("../services/product-service");

module.exports = (app) => {
  const service = new ProductService();

  app.post("/products/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;

      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/products", async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};
