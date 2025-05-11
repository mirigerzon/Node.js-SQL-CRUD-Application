const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.get('/:table', async (req, res) => {
  const table = req.params.table;
  try{
    const conditions = createConditions(req);
    const data = await dataService.getItemByConditions(table, conditions.length ? conditions : undefined);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR requesting ${table}` });
  }
});

router.get('/:table/:itemId', async (req, res) => {
  const tableName = req.params.table.slice(0, -1);
  try {
    const conditions = createConditions(req);
    conditions.push({ field: 'id', value: req.params.itemId });
    const item = await dataService.getItemByConditions(req.params.table, conditions);
    console.log(item);
    res.json(item);
  }
  catch {
    res.status(500).json({ error: `ERROR requesting ${tableName} by id` });
  }
});

router.get('/:parentTable/:parentId/:childTable', async (req, res) => {
  const parentName = req.params.parentTable.slice(0, -1);
  try {
    const conditions = createConditions(req);
    conditions.push({ field: `${parentName}_id`, value: req.params.parentId });
    const data = await dataService.getItemByConditions(req.params.childTable, conditions);
    res.json(data);
  }
  catch {
    res.status(500).json({ error: `ERROR requesting ${req.params.childTable} by ${parentName} id` });
  }
});

const createConditions = (req) => {
  const query = req.query;
  if (query.user_id === 'null') {
    query.user_id = req.user?.id;
  }
  let conditions = [];
  if (Object.keys(query).length > 0) {
    conditions = Object.entries(query).map(([key, value]) => ({
      field: key,
      value: isNaN(value) ? value : Number(value)
    }));
  }
  return conditions;
};




module.exports = router;
