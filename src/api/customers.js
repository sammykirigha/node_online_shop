const CustomerService = require("../services/customer-service");

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
};
