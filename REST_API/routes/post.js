const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await dataService.verifyLogin(username, password);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    res.json(user);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await dataService.registerNewUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

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


module.exports = router;
