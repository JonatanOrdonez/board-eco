import Boom from '@hapi/boom';
import {
  createBoardRepository,
  createTicketRepository,
  deleteBoardRepository,
  getBoardByIdRepository,
  getBoardsRepository,
  getTicketByIdRepository,
  getTicketsByBoardIdRepository,
  updateTicketStatusRepository,
} from './boards.repository';
import {
  Board,
  CreateBoardDTO,
  CreateTicketDTO,
  Ticket,
  UpdateTicketStatusDTO,
} from './boards.types';

export const createBoardService = async (board: CreateBoardDTO): Promise<Board> => {
  return createBoardRepository(board);
};

export const getBoardsService = async (): Promise<Board[]> => {
  return getBoardsRepository();
};

export const getBoardByIdService = async (id: string): Promise<Board> => {
  const board = await getBoardByIdRepository(id);

  if (!board) {
    throw Boom.notFound('Board not found');
  }

  return board;
};

export const deleteBoardService = async (id: string): Promise<void> => {
  const board = await getBoardByIdRepository(id);

  if (!board) {
    throw Boom.notFound('Board not found');
  }

  await deleteBoardRepository(id);
};

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
  boardId: string,
  id: string,
  { status }: UpdateTicketStatusDTO,
): Promise<Ticket> => {
  const ticket = await getTicketByIdRepository(id);

  if (!ticket || ticket.boardId !== boardId) {
    throw Boom.notFound('Ticket not found');
  }

  return updateTicketStatusRepository(id, status);
};
