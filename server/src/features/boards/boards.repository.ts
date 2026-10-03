import { pool } from '../../db/db';
import { Board, CreateBoardDTO } from './boards.types';

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
