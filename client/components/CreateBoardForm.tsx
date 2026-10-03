'use client';

import { useState } from 'react';
import { useBoards } from '@/context/BoardsContext';

export const CreateBoardForm = () => {
  const { createBoard } = useBoards();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBoard(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border rounded px-2 py-1"
        placeholder="Board name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="border rounded px-2 py-1">
        Create board
      </button>
    </form>
  );
};
