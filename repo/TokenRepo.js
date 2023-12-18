const TokenModel = require("../models/TokenModel");

const createToken = async (obj) => {
  return await TokenModel.create(obj);
};

const findOneByObject = async (obj) => {
  return await TokenModel.findOne(obj);
};

const deleteToken = async (obj) => {
  return await TokenModel.findOneAndDelete(obj);
};
module.exports = {
  createToken,
  findOneByObject,
  deleteToken,
};
