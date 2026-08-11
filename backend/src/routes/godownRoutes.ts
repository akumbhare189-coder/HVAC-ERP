import { Router } from 'express';
import {
  getGodowns,
  getGodownById,
  createGodown,
  updateGodown,
  deleteGodown,
} from '../controllers/godownController';

const router = Router();

router.get('/', getGodowns);
router.get('/:id', getGodownById);
router.post('/', createGodown);
router.put('/:id', updateGodown);
router.delete('/:id', deleteGodown);

export default router;