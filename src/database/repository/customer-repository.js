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
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Customer"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
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
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  // async FindCustomerById({ id }) {
  //   try {
  //     console.log("============");
  //     const existingCustomer = await CustomerModel.findById(id).populate(
  //       "address wishlist orders cart.product"
  //     );

  //     console.log("pop", existingCustomer);
  //     return existingCustomer;
  //   } catch (err) {
  //     console.log(err);
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Unable to Find Customer!!!!!!!"
  //     );
  //   }
  // }

  async GetWishlist(customerId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );

      return profile.wishlist;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Wishlist "
      );
    }
  }

  async AddToWishlist(customerId, product) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishlist"
      );

      if (profile) {
        let wishlist = profile.wishlist;

        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }

        profile.wishlist = wishlist;
      }

      const profileResult = await profile.save();

      return profileResult.wishlist;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Add to WishList"
      );
    }
  }
}

module.exports = CustomerRepository;
