'use client';

import { useState } from 'react';
import { useBoard } from '@/context/BoardContext';

export const CreateTicketForm = () => {
  const { createTicket } = useBoard();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createTicket(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border rounded px-2 py-1"
        placeholder="Ticket description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="border rounded px-2 py-1">
        Create ticket
      </button>
    </form>
  );
};
