const { CustomerModel, AddressModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");

class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        phone,
        salt,
        address: [],
      });

      const customerResult = await customer.save();
      return customerResult;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Customer"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      try {
        const profile = await CustomerModel.findById(_id);

        if (profile) {
          const newAddress = new AddressModel({
            street,
            postalCode,
            city,
            country,
          });

          await newAddress.save();

          profile.address.push(newAddress);
        }

        return await profile.save();
      } catch (err) {
        throw APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Error on Create Address"
        );
      }
    } catch (error) {}
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }
}

module.exports = CustomerRepository;
