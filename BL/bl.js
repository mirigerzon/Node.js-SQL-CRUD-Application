// BL/dataService.js
const dal = require('../DAL/dal.js');

const getItemByConditions = async (table, conditions = []) => {
  console.log(`i am in bl.getItemByConditions func with table: ${table}`); 
  const res = await dal.GET(table, conditions);
  return res[0] || null;
};

const deleteItem = async (table, conditions = []) => {
  return await dal.DELETE(table, conditions);
};

const createItem = async (table, data) => {
  return await dal.insert(table, data);
};



module.exports = {
  getItemByConditions,
  deleteItem,
  createItem
};
