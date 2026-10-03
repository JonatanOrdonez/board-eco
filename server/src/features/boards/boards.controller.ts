import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import { TicketStatus } from './boards.types';
import {
  createBoardService,
  createTicketService,
  deleteBoardService,
  getBoardByIdService,
  getBoardsService,
  getTicketsByBoardIdService,
  updateTicketService,
} from './boards.service';

const VALID_STATUSES: TicketStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

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

export const createTicketController = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;

  if (!req.body.content) {
    throw Boom.badRequest('Content is required');
  }

  const newTicket = await createTicketService({
    boardId: String(boardId),
    content: req.body.content,
  });

  res.status(201).json(newTicket);
};

export const getTicketsController = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  const tickets = await getTicketsByBoardIdService(String(boardId));
  res.status(200).json(tickets);
};

export const updateTicketController = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  const id = req.params.id;
  const status = req.body.status;

  if (!VALID_STATUSES.includes(status)) {
    throw Boom.badRequest('Status must be one of TODO, IN_PROGRESS, DONE');
  }

  const updatedTicket = await updateTicketService(String(boardId), String(id), { status });

  res.status(200).json(updatedTicket);
};
