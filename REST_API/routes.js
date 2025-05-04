const express = require('express');
const router = express.Router();
const dataService = require('../BL/bl');

router.get('/users', async (req, res) => {
  try {
    const users = await dataService.getAll('users');
    res.json(users);
  } catch {
    res.status(500).json({ error: 'ERROR requesting users' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const user = await dataService.getItemById('users', req.params.userId);
    res.json(user);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting user by id' });
  }
});

router.get('/users/:userId/todos', async (req, res) => {
  try {
    const userTodos = await dataService.getItemsByItemId('todos', 'user_id', req.params.userId);
    res.json(userTodos);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting todos by user id' });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await dataService.getAll('posts');
    res.json(posts);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting posts' });
  }
});

router.get('/users/:userId/posts', async (req, res) => {
  try {
    const posts = await dataService.getItemsByItemId('posts', 'user_id', req.params.userId);
    res.json(posts);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting posts' });
  }
});

router.get('/posts/:postId', async (req, res) => {
  try {
    const post = await dataService.getItemById('posts', req.params.postId, 'post_id', req.params.postId);
    res.json(post);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting post by id' });
  }
});

router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await dataService.getItemsByItemId('comments', 'post_id', req.params.postId);
    res.json(comments);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting comments' });
  }
});

// לשלוח מערך להשוואה בבדיקות אצל BL
router.get('users/:user_id/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await dataService.getItemsByItemId('comments', 'post_id', req.params.postId);
    res.json(comments);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting comments' });
  }
});

// לשלוח מערך להשוואה בבדיקות אצל BL
router.get('/posts/:postsId/comments/:commentId', async (req, res) => {
  try {
    const comments = await dataService.getItemById('comments', req.params.commentId, 'post_id', req.params.postsId);
    res.json(comments);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting comments' });
  }
});

// לשלוח מערך להשוואה בבדיקות אצל BL
router.get('users/:user_id/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const comments = await dataService.getItemsByItemId('comments', 'post_id', req.params.postId);
    res.json(comments);
  }
  catch {
    res.status(500).json({ error: 'ERROR requesting comments' });
  }
});



module.exports = router;
