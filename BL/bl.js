// BL/dataService.js
const dal = require('../DAL/dal.js');

const getItemByConditions = async (table, conditions = []) => {
  console.log(`i am in bl.getItemByConditions func with table: ${table}`); 
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


module.exports = {
  getItemByConditions,
  deleteItem,
  createItem,
  updateItem
};
