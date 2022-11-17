const CustomerRepository = require("../database/repository/customer-repository");
const {
  ValidatePassword,
  GenerateSignature,
  FormateData,
  GenerateSalt,
  GeneratePassword,
} = require("../utils");
const { APIError } = require("../utils/app-error");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIN(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );
        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({ id: existingCustomer._id, token });
        }
      }
      return FormateData(null);
    } catch (error) {
      throw new APIError("Data Not Found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;

    try {
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        _id: existingCustomer._id,
      });

      return FormateData({ id: existingCustomer._id, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = CustomerService;
