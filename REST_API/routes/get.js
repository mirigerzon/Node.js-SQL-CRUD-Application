const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.get('/:table', async (req, res) => {
  const table = req.params.table;
  const query = req.query;

  try {
    let conditions = [];
    if (Object.keys(query).length > 0) {
      conditions = Object.entries(query).map(([key, value]) => ({
        field: key,
        value: isNaN(value) ? value : Number(value)
      }));
    }

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
    const item = await dataService.getItemByConditions(req.params.table, [{ field: 'id', value: req.params.itemId }]);
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
    const data = await dataService.getItemByConditions(req.params.childTable, [{ field: `${parentName}_id`, value: req.params.parentId }]);
    res.json(data);
  }
  catch {
    res.status(500).json({ error: `ERROR requesting ${req.params.childTable} by ${parentName} id` });
  }
});

router.get('/:parentTable/:parentId/:childTable/:childId', async (req, res) => {
  try {
    const conditions = [
      { field: `${req.params.parentTable.slice(0, -1)}_id`, value: req.params.parentId },
      { field: 'id', value: req.params.childId }
    ];
    const data = await dataService.getItemByConditions(req.params.childTable, conditions);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: `ERROR requesting ${req.params.childTable} by conditions` });
  }
});

module.exports = router;
