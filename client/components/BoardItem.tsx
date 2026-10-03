'use client';

import Link from 'next/link';
import { Board } from '@/lib/types';

interface BoardItemProps {
  board: Board;
  onDelete: () => void;
  href?: string;
}

export const BoardItem = ({ board, onDelete, href }: BoardItemProps) => {
  return (
    <div className="flex items-center justify-between border rounded px-3 py-2">
      {href ? <Link href={href}>{board.name}</Link> : <span>{board.name}</span>}
      <button onClick={onDelete} className="border rounded px-2 py-1">
        Delete
      </button>
    </div>
  );
};
