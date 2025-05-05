const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.put('/:table/:itemId', async (req, res) => {
    try {
        const result = await dataService.updateItem(
            req.params.table,
            req.body,
            [{ field: 'id', value: req.params.itemId }]
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `ERROR updating ${req.params.table} item` });
    }
});

router.put('/:parentTable/:parentId/:childTable/:childId', async (req, res) => {
    const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
    try {
        const result = await dataService.updateItem(
            req.params.childTable,
            req.body,
            [
                { field: parentField, value: req.params.parentId },
                { field: 'id', value: req.params.childId }
            ]
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `ERROR updating ${req.params.childTable} item` });
    }
});

router.put('/:parentTable/:parentId/:childTable/:childId/:grandChildTable/:grandChildId', async (req, res) => {
    const childField = `${req.params.childTable.slice(0, -1)}_id`;
    try {
        const result = await dataService.updateItem(
            req.params.grandChildTable,
            req.body,
            [
                { field: childField, value: req.params.childId },
                { field: 'id', value: req.params.grandChildId }
            ]
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `ERROR updating ${req.params.grandChildTable} item` });
    }
});

module.exports = router;

