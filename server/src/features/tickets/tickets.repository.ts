import { pool } from '../../db/db';
import { CreateTicketDTO, Ticket, TicketStatus } from '../boards/boards.types';

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
