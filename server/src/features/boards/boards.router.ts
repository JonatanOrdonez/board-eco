import { Router } from 'express';
import {
  createBoardController,
  deleteBoardController,
  getBoardByIdController,
  getBoardsController,
} from './boards.controller';

const router = Router();

router.post('/boards', createBoardController);
router.get('/boards', getBoardsController);
router.get('/boards/:id', getBoardByIdController);
router.delete('/boards/:id', deleteBoardController);

export default router;
