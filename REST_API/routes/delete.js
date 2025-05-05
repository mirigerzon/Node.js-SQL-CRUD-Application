const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

// מחיקת פריט לפי טבלה ו-id
router.delete('/:table/:itemId', async (req, res) => {
  try {
    const result = await dataService.deleteItem(req.params.table, [
      { field: 'id', value: req.params.itemId }
    ]);
    res.json({ message: 'Deleted successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR deleting from ${req.params.table}` });
  }
});

// מחיקה של ילד לפי אב
router.delete('/:parentTable/:parentId/:childTable/:childId', async (req, res) => {
  const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
  try {
    const result = await dataService.deleteItem(req.params.childTable, [
      { field: 'id', value: req.params.childId },
      { field: parentField, value: req.params.parentId }
    ]);
    res.json({ message: 'Deleted successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR deleting from ${req.params.childTable}` });
  }
});

// מחיקה ברמת נכד
router.delete('/:parentTable/:parentId/:childTable/:childId/:grandChildTable/:grandChildId', async (req, res) => {
  const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
  const childField = `${req.params.childTable.slice(0, -1)}_id`;
  try {
    const result = await dataService.deleteItem(req.params.grandChildTable, [
      { field: 'id', value: req.params.grandChildId },
      { field: childField, value: req.params.childId },
      { field: parentField, value: req.params.parentId }
    ]);
    res.json({ message: 'Deleted successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR deleting from ${req.params.grandChildTable}` });
  }
});

module.exports = router;
