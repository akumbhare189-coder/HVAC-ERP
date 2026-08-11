import { Router } from 'express';
import {
  getServiceCalls,
  getServiceCallById,
  createServiceCall,
  updateServiceCall,
  deleteServiceCall,
  assignTechnician,
} from '../controllers/serviceCallController';

const router = Router();

router.get('/', getServiceCalls);
router.get('/:id', getServiceCallById);
router.post('/', createServiceCall);
router.put('/:id', updateServiceCall);
router.delete('/:id', deleteServiceCall);
router.post('/:id/assign', assignTechnician);

export default router;