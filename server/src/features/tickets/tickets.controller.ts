import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import { TicketStatus } from '../boards/boards.types';
import {
  createTicketService,
  getTicketsByBoardIdService,
  updateTicketService,
} from './tickets.service';

const VALID_STATUSES: TicketStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

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
  const id = req.params.id;
  const status = req.body.status;

  if (!VALID_STATUSES.includes(status)) {
    throw Boom.badRequest('Status must be one of TODO, IN_PROGRESS, DONE');
  }

  const updatedTicket = await updateTicketService(String(id), { status });

  res.status(200).json(updatedTicket);
};
