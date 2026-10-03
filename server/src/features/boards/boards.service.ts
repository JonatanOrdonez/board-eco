import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
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

export const broadcastToBoards = async (event: string, payload: object) => {
  const channel = supabase.channel('boards');
  try {
    await channel.httpSend(event, payload);
  } catch (error) {
    console.error(`Failed to broadcast ${event}`, error);
  } finally {
    await supabase.removeChannel(channel);
  }
};

export const broadcastToBoard = async (boardId: string, event: string, payload: object) => {
  const channel = supabase.channel(`boards:${boardId}`);
  try {
    await channel.httpSend(event, payload);
  } catch (error) {
    console.error(`Failed to broadcast ${event}`, error);
  } finally {
    await supabase.removeChannel(channel);
  }
};

export const createBoardService = async (board: CreateBoardDTO): Promise<Board> => {
  const newBoard = await createBoardRepository(board);
  broadcastToBoards('board-created', newBoard);
  return newBoard;
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
  broadcastToBoards('board-deleted', { id });
};

export const createTicketService = async (ticket: CreateTicketDTO): Promise<Ticket> => {
  const board = await getBoardByIdRepository(ticket.boardId);

  if (!board) {
    throw Boom.notFound('Board not found');
  }

  const newTicket = await createTicketRepository(ticket);
  broadcastToBoard(newTicket.boardId, 'ticket-created', newTicket);
  return newTicket;
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

  const updatedTicket = await updateTicketStatusRepository(id, status);
  broadcastToBoard(updatedTicket.boardId, 'ticket-updated', updatedTicket);
  return updatedTicket;
};
