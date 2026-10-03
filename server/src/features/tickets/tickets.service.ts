import Boom from '@hapi/boom';
import { getBoardByIdRepository } from '../boards/boards.repository';
import { CreateTicketDTO, Ticket, UpdateTicketStatusDTO } from '../boards/boards.types';
import {
  createTicketRepository,
  getTicketByIdRepository,
  getTicketsByBoardIdRepository,
  updateTicketStatusRepository,
} from './tickets.repository';

export const createTicketService = async (ticket: CreateTicketDTO): Promise<Ticket> => {
  const board = await getBoardByIdRepository(ticket.boardId);

  if (!board) {
    throw Boom.notFound('Board not found');
  }

  return createTicketRepository(ticket);
};

export const getTicketsByBoardIdService = async (boardId: string): Promise<Ticket[]> => {
  const board = await getBoardByIdRepository(boardId);

  if (!board) {
    throw Boom.notFound('Board not found');
  }

  return getTicketsByBoardIdRepository(boardId);
};

export const updateTicketService = async (
  id: string,
  { status }: UpdateTicketStatusDTO,
): Promise<Ticket> => {
  const ticket = await getTicketByIdRepository(id);

  if (!ticket) {
    throw Boom.notFound('Ticket not found');
  }

  return updateTicketStatusRepository(id, status);
};
