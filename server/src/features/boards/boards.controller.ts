import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import {
  createBoardService,
  deleteBoardService,
  getBoardByIdService,
  getBoardsService,
} from './boards.service';

export const createBoardController = async (req: Request, res: Response) => {
  if (!req.body.name) {
    throw Boom.badRequest('Name is required');
  }

  const newBoard = await createBoardService({ name: req.body.name });

  res.status(201).json(newBoard);
};

export const getBoardsController = async (req: Request, res: Response) => {
  const boards = await getBoardsService();
  res.status(200).json(boards);
};

export const getBoardByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const board = await getBoardByIdService(String(id));
  res.status(200).json(board);
};

export const deleteBoardController = async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteBoardService(String(id));
  res.status(204).send();
};
