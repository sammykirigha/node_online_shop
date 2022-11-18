const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/customer/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/signin", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIN({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, city, postalCode, country } = req.body;

      const { data } = await service.CreateAddress(_id, {
        street,
        city,
        postalCode,
        country,
      });

      console.log("data", data);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // app.get("/customer/profile", UserAuth, async (req, res, next) => {
  //   try {
  //     const { _id } = req.user;
  //     const { data } = await service.GetProfile({ _id });
  //     return res.json(data);
  //   } catch (err) {
  //     next(err);
  //   }
  // });
};
