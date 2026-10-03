import { Router } from 'express';
import {
  createTicketController,
  getTicketsController,
  updateTicketController,
} from './tickets.controller';

const router = Router();

router.post('/boards/:boardId/tickets', createTicketController);
router.get('/boards/:boardId/tickets', getTicketsController);
router.patch('/tickets/:id', updateTicketController);

export default router;
