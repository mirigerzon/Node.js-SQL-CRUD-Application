const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.post('/:table', async (req, res) => {
    try {
      const created = await dataService.createItem(req.params.table, req.body);
      res.status(201).json({ message: 'Created successfully', result: created });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `ERROR inserting into ${req.params.table}` });
    }
  });
  
router.post('/:parentTable/:parentId/:childTable', async (req, res) => {
  const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
  const data = {
    ...req.body,
    [parentField]: req.params.parentId
  };
  try {
    const created = await dataService.createItem(req.params.childTable, data);
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR inserting into ${req.params.childTable}` });
  }
});

router.post('/:parentTable/:parentId/:childTable/:childId/:grandChildTable', async (req, res) => {
  const childField = `${req.params.childTable.slice(0, -1)}_id`;
  const data = {
    ...req.body,
    [childField]: req.params.childId
  };
  try {
    const created = await dataService.createItem(req.params.grandChildTable, data);
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR inserting into ${req.params.grandChildTable}` });
  }
});

module.exports = router;
