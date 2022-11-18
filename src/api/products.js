const CustomerService = require("../services/customer-service");
const ProductService = require("../services/product-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ProductService();
  const customerService = new CustomerService();

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
  app.get("/products/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const { data } = await service.GetProductsBySelectedIds(ids);
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.get("/products/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { data } = await service.GetProductById(id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    try {
      const type = req.params.type;
      const { data } = await service.GetProductByCategory(type);
      return res.json(data);
    } catch (error) {
      next(err);
    }
  });

  app.post("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const id = req.body._id;
      const product = await service.GetProductById(id);
      const wishList = await customerService.AddToWishList(_id, product);
      return res.status(200).json(wishList);
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const wishList = await customerService.GetWishList(_id);
      return res.status(200).json(wishList);
    } catch (error) {
      next(err);
    }
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const product = await service.GetProductById(productId);
      const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishlist);
    } catch (err) {
      next(err);
    }
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id, qty } = req.body;

    try {
      const product = await service.GetProductById(_id);

      const result = await customerService.ManageCart(
        req.user._id,
        product,
        qty,
        false
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await service.GetProductById(req.params.id);
      const result = await customerService.ManageCart(_id, product, 0, true);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
