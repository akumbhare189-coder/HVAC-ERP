import { Router } from 'express';
import {
  getInventoryUnits,
  getInventoryUnitById,
  createInventoryUnit,
  updateInventoryUnit,
  deleteInventoryUnit,
} from '../controllers/inventoryController';

const router = Router();

router.get('/', getInventoryUnits);
router.get('/:id', getInventoryUnitById);
router.post('/', createInventoryUnit);
router.put('/:id', updateInventoryUnit);
router.delete('/:id', deleteInventoryUnit);

export default router;