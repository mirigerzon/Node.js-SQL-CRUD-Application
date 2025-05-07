const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await dataService.verifyLogin(username, password);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await dataService.registerNewUser(req.body);
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.post('/:table', async (req, res) => {
  try {
    const body = enrichBodyWithUserId(req);
    const created = await dataService.createItem(req.params.table, body);
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR inserting into ${req.params.table}` });
  }
});

router.post('/:parentTable/:parentId/:childTable', async (req, res) => {
  try {
    const parentField = `${req.params.parentTable.slice(0, -1)}_id`;

    const baseData = enrichBodyWithUserId(req);
    const data = {
      ...baseData,
      [parentField]: req.params.parentId
    };

    const created = await dataService.createItem(req.params.childTable, data);
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `ERROR inserting into ${req.params.childTable}` });
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
