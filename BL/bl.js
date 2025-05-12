// BL/dataService.js
const dal = require('../DAL/dal.js');
const bcrypt = require('bcrypt');

const getItemByConditions = async (table, conditions = []) => {
  const res = await dal.GET(table, conditions);
  return res || null;
};

const deleteItem = async (table, conditions = []) => {
  return await dal.DELETE(table, conditions);
};

const createItem = async (table, data) => {
  return await dal.POST(table, data);
};

const updateItem = async (table, data, conditions = []) => {
  return await dal.PUT(table, data, conditions);
};

const verifyLogin = async (username, password) => {
  const users = await dal.GET('users', [
    { field: 'username', value: username }
  ]);
  if (!users || users.length === 0)
    return null;
  const user = users[0];
  const hashedPasswords = await dal.GET('passwords', [
    { field: 'user_id', value: user.id }
  ]);
  if (!hashedPasswords || hashedPasswords.length === 0) return null;
  const hashedPassword = hashedPasswords[0].hashed_password;
  const isMatch = await bcrypt.compare( password,hashedPassword);
  if (!isMatch) return null;
  delete user.hashed_password;
  return user;
};

const registerNewUser = async (userData) => {
  const { username, email, phone, name, password } = userData;
  const existingUsers = await dal.GET('users', [
    { field: 'username', value: username }
  ]);
  if (existingUsers.length > 0) throw new Error('Username already exists');
  const hashedPassword = await hashPassword(password);
  const newUser = await dal.POST('users', {
    username, name, email, phone
  });
  await dal.POST('passwords', {
    user_id: newUser.insertId,
    hashed_password: hashedPassword
  });
  return { id: newUser.insertId, username, name, email, phone };
};

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

module.exports = {
  getItemByConditions,
  deleteItem,
  createItem,
  updateItem,
  verifyLogin,
  registerNewUser
};
