'use client';

import { useBoards } from '@/context/BoardsContext';
import { BoardItem } from './BoardItem';

export const BoardsList = () => {
  const { boards, deleteBoard } = useBoards();

  return (
    <div className="flex flex-col gap-2">
      {boards.map((board) => (
        <BoardItem
          key={board.id}
          board={board}
          href={`/boards/${board.id}`}
          onDelete={() => deleteBoard(board.id)}
        />
      ))}
    </div>
  );
};
