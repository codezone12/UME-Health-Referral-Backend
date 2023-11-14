const UserModel = require('../models/UserModel')
const UserRoles = ['Admin', 'Approver', 'User']
const UserRoleObject = {
  admin: 'Admin',
  approver: 'Approver',
  user: 'User',
  nurse: 'Nurse'
}

/**
 * @returns {Array}
 */
const getAllUsers = async () => {
    return await UserModel.find({})
  };


/**
 * @param obj
 * @returns {UserModel}
 */
const createUser = async (name, email, password , role) => {
    return await UserModel.create({name, email, password, role})
  };


/**
 * @param object
 * @returns {UserModel}
 */
const findOneByObject = async (obj) => {
     return await UserModel.findOne(obj)
  };





module.exports = {
    UserRoleObject,
    UserRoles,
    getAllUsers,
    createUser,
    findOneByObject,



}