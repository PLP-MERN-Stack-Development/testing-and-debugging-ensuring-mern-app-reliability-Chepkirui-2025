// posts.js - Post routes

const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;