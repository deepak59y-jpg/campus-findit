import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import { itemRules, validate } from '../middleware/validation.js';

const router = express.Router();

// Publicly read, privately create items
router
  .route('/')
  .get(getItems)
  .post(protect, itemRules, validate, createItem);

// Publicly view detail, privately edit or delete items
router
  .route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;
