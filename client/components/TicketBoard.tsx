'use client';

import { useBoard } from '@/context/BoardContext';
import { TicketColumn } from './TicketColumn';

export const TicketBoard = () => {
  const { tickets } = useBoard();

  const todoTickets = tickets.filter((ticket) => ticket.status === 'TODO');
  const inProgressTickets = tickets.filter((ticket) => ticket.status === 'IN_PROGRESS');
  const doneTickets = tickets.filter((ticket) => ticket.status === 'DONE');

  return (
    <div className="flex gap-4">
      <TicketColumn title="TO-DO" tickets={todoTickets} />
      <TicketColumn title="IN-PROGRESS" tickets={inProgressTickets} />
      <TicketColumn title="DONE" tickets={doneTickets} />
    </div>
  );
};
