import { Router } from 'express';
import {
  createBoardController,
  createTicketController,
  deleteBoardController,
  getBoardByIdController,
  getBoardsController,
  getTicketsController,
  updateTicketController,
} from './boards.controller';

const router = Router();

router.post('/boards', createBoardController);
router.get('/boards', getBoardsController);
router.get('/boards/:id', getBoardByIdController);
router.delete('/boards/:id', deleteBoardController);

router.post('/boards/:boardId/tickets', createTicketController);
router.get('/boards/:boardId/tickets', getTicketsController);
router.patch('/boards/:boardId/tickets/:id', updateTicketController);

export default router;
