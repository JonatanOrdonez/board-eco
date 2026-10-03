import Boom from '@hapi/boom';
import {
  createBoardRepository,
  deleteBoardRepository,
  getBoardByIdRepository,
  getBoardsRepository,
} from './boards.repository';
import { Board, CreateBoardDTO } from './boards.types';

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
