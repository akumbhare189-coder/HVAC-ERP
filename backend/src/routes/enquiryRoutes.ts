import { Router } from 'express';
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  convertEnquiryToProject,
} from '../controllers/enquiryController';

const router = Router();

router.get('/', getEnquiries);
router.get('/:id', getEnquiryById);
router.post('/', createEnquiry);
router.put('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);
router.post('/:id/convert', convertEnquiryToProject);

export default router;