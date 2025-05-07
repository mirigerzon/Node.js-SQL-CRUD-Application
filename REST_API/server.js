const express = require('express');
const cors = require('cors');

const getRoutes = require('./routes/get');
const postRoutes = require('./routes/post');
const putRoutes = require('./routes/put');
const deleteRoutes = require('./routes/delete');
const verifyToken = require('./verifyToken');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use(verifyToken);
app.use('/', getRoutes);
app.use('/', postRoutes);
app.use('/', putRoutes);
app.use('/', deleteRoutes);

app.listen(PORT, () => {
  console.log(`The server runs on port: ${PORT}`);
});
