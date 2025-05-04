const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);
app.use('/users', routes);
app.use('/users/:userId', routes);
app.use('/users/:userId/todos', routes);
app.use('/posts', routes);
app.use('/users/:userId/posts', routes);
app.use('/posts/:postId', routes);
app.use('/posts/:postId/comments', routes);
app.use('/posts/:postId/comments/:commentId', routes);


app.listen(PORT, () => {
  console.log(`The server runs on port: ${PORT}`);
});
