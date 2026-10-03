import { pool } from '../../db/db';
import { Board, CreateBoardDTO, CreateTicketDTO, Ticket, TicketStatus } from './boards.types';

export const createBoardRepository = async (board: CreateBoardDTO): Promise<Board> => {
  const result = await pool.query<Board>(
    'INSERT INTO public.boards (name) VALUES ($1) RETURNING id, name',
    [board.name],
  );

  return result.rows[0];
};

export const getBoardsRepository = async (): Promise<Board[]> => {
  const result = await pool.query<Board>('SELECT id, name FROM public.boards');

  return result.rows;
};

export const getBoardByIdRepository = async (id: string): Promise<Board | undefined> => {
  const result = await pool.query<Board>('SELECT id, name FROM public.boards WHERE id = $1', [
    id,
  ]);

  return result.rows[0];
};

export const deleteBoardRepository = async (id: string): Promise<void> => {
  await pool.query('DELETE FROM public.boards WHERE id = $1', [id]);
};

export const createTicketRepository = async (ticket: CreateTicketDTO): Promise<Ticket> => {
  const result = await pool.query<Ticket>(
    `INSERT INTO public.tickets (content, board_id)
     VALUES ($1, $2)
     RETURNING id, board_id AS "boardId", content, status`,
    [ticket.content, ticket.boardId],
  );

  return result.rows[0];
};

export const getTicketsByBoardIdRepository = async (boardId: string): Promise<Ticket[]> => {
  const result = await pool.query<Ticket>(
    `SELECT id, board_id AS "boardId", content, status
     FROM public.tickets
     WHERE board_id = $1`,
    [boardId],
  );

  return result.rows;
};

export const getTicketByIdRepository = async (id: string): Promise<Ticket | undefined> => {
  const result = await pool.query<Ticket>(
    `SELECT id, board_id AS "boardId", content, status
     FROM public.tickets
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

export const updateTicketStatusRepository = async (
  id: string,
  status: TicketStatus,
): Promise<Ticket> => {
  const result = await pool.query<Ticket>(
    `UPDATE public.tickets
     SET status = $2
     WHERE id = $1
     RETURNING id, board_id AS "boardId", content, status`,
    [id, status],
  );

  return result.rows[0];
};
