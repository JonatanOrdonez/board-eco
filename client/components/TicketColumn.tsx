'use client';

import { Ticket } from '@/lib/types';
import { TicketCard } from './TicketCard';

interface TicketColumnProps {
  title: string;
  tickets: Ticket[];
}

export const TicketColumn = ({ title, tickets }: TicketColumnProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex flex-col gap-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};
