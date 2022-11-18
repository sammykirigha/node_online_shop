const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config");

//utility functions

module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

module.exports.ValidateSignature = async (req) => {
  const authBearer = req.get("Authorization");

  if (!authBearer) return false;

  const token = authBearer.split(" ")[1];

  if (!token) return false;

  const payload = await jwt.verify(token, APP_SECRET);
  req.user = payload;
  return true;
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    return { data: null };
  }
};
