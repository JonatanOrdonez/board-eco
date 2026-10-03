'use client';

import { Ticket, TicketStatus } from '@/lib/types';
import { useBoard } from '@/context/BoardContext';

const STATUSES: TicketStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { updateTicketStatus } = useBoard();

  return (
    <div className="flex flex-col gap-2 border rounded px-3 py-2">
      <p>{ticket.content}</p>
      <select
        className="border rounded px-2 py-1"
        value={ticket.status}
        onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};
