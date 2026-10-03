'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import { Board } from '@/lib/types';

interface BoardsContextValue {
  boards: Board[];
  createBoard: (name: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
}

const appendBoard = (boards: Board[], board: Board) =>
  boards.some((b) => b.id === board.id) ? boards : [...boards, board];

const BoardsContext = createContext<BoardsContextValue | null>(null);

export const BoardsProvider = ({ children }: { children: React.ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const boardsChannel = supabase
      .channel('boards')
      .on('broadcast', { event: 'board-created' }, ({ payload }) => {
        setBoards((prev) => appendBoard(prev, payload as Board));
      })
      .on('broadcast', { event: 'board-deleted' }, ({ payload }) => {
        setBoards((prev) => prev.filter((board) => board.id !== (payload as { id: string }).id));
      })
      .subscribe();

    const onInit = async () => {
      const res = await api.get<Board[]>('/boards');
      setBoards((prev) => res.data.reduce(appendBoard, prev));
    };

    onInit();

    return () => {
      supabase.removeChannel(boardsChannel);
    };
  }, []);

  const createBoard = async (name: string) => {
    const res = await api.post<Board>('/boards', { name });
    setBoards((prev) => appendBoard(prev, res.data));
  };

  const deleteBoard = async (id: string) => {
    await api.delete(`/boards/${id}`);
    setBoards((prev) => prev.filter((board) => board.id !== id));
  };

  return (
    <BoardsContext.Provider value={{ boards, createBoard, deleteBoard }}>
      {children}
    </BoardsContext.Provider>
  );
};

export const useBoards = () => {
  const context = useContext(BoardsContext);

  if (!context) {
    throw new Error('useBoards must be used within a BoardsProvider');
  }

  return context;
};
