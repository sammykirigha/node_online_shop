const express = require("express");
const { customer, product, shopping } = require("./api");
const cors = require("cors");
const ErrorHandler = require("./utils/error-handler");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //api
  customer(app);
  product(app);
  shopping(app);

  app.use(ErrorHandler);
};
