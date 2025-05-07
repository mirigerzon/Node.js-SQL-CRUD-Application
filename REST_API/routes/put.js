const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.put('/:table/:itemId', async (req, res) => {
    try {
        const body = enrichBodyWithUserId(req);
        const result = await dataService.updateItem(
            req.params.table,
            body,
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
        const baseData = enrichBodyWithUserId(req);
        const body = {
            ...baseData,
            [parentField]: req.params.parentId
        };

        const result = await dataService.updateItem(
            req.params.childTable,
            body,
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

const enrichBodyWithUserId = (req) => {
    const body = { ...req.body };
    if (body.user_id === 'null') {
        body.user_id = req.user?.id;
    }
    return body;
};

module.exports = router;
