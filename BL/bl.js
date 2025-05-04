// BL/dataService.js
const dal = require('../DAL/dal.js');

const getAll = async (type) => {
  return await dal.getAll(type);
};

// לקבל מערך להשוואת נתונים עם מי ששלח אותם לעבור ולבדוק שכולם שולחים את הנתונים
const getItemById = async (type, id, fieldToCheck = null, volueToCheck = null) => {
  const res = await dal.getItemsById(type, 'id', id);
  if (fieldToCheck) {
    if (res.fieldToCheck !== volueToCheck)
      return null;
  }
  return res;
};
const getItemsByItemId = async (type, typeToCompare, id) => {
  return await dal.getItemsById(type, typeToCompare, id)
};


module.exports = {
  getAll,
  getItemById,
  getItemsByItemId
};
