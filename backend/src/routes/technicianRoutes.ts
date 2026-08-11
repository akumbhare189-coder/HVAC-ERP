import { Router } from 'express';
import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
} from '../controllers/technicianController';

const router = Router();

router.get('/', getTechnicians);
router.get('/:id', getTechnicianById);
router.post('/', createTechnician);
router.put('/:id', updateTechnician);
router.delete('/:id', deleteTechnician);

export default router;