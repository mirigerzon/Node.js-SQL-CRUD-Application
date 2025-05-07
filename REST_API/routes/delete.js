const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.delete('/:table/:itemId', async (req, res) => {
  try {
    const baseConditions = [{ field: 'id', value: req.params.itemId }];
    const conditions = enrichConditionsWithUserIdIfExists(req, baseConditions);
    const result = await dataService.deleteItem(req.params.table, conditions);
    res.json({ message: 'Deleted successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR deleting from ${req.params.table}` });
  }
});

router.delete('/:parentTable/:parentId/:childTable/:childId', async (req, res) => {
  const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
  try {
    const baseConditions = [
      { field: 'id', value: req.params.childId },
      { field: parentField, value: req.params.parentId }
    ];
    const conditions = enrichConditionsWithUserIdIfExists(req, baseConditions);
    const result = await dataService.deleteItem(req.params.childTable, conditions);
    res.json({ message: 'Deleted successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR deleting from ${req.params.childTable}` });
  }
});

const enrichConditionsWithUserIdIfExists = (req, conditions = []) => {
  if (req.body.user_id === 'null') {
    conditions.push({ field: 'user_id', value: req.user.id });
  }
  return conditions;
};

module.exports = router;
