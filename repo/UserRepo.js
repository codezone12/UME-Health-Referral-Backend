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
const getAllUsers = async (obj) => {
    return await UserModel.find(obj)
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


const updateUser = async (_id, verified) => {
  return await UserModel.findOneAndUpdate({_id}, {$set : {verified}}, {new : true})
}

const updateProfile = async (userId, data) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      {_id:userId},
      { $set: data },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
    UserRoleObject,
    UserRoles,
    getAllUsers,
    createUser,
    findOneByObject,
    updateUser,
    updateProfile


}