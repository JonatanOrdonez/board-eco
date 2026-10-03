'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import { Board, Ticket, TicketStatus } from '@/lib/types';

interface BoardContextValue {
  board: Board | null;
  tickets: Ticket[];
  createTicket: (content: string) => Promise<void>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  deleteBoard: () => Promise<void>;
}

const appendTicket = (tickets: Ticket[], ticket: Ticket) =>
  tickets.some((t) => t.id === ticket.id) ? tickets : [...tickets, ticket];

const BoardContext = createContext<BoardContextValue | null>(null);

export const BoardProvider = ({
  boardId,
  children,
}: {
  boardId: string;
  children: React.ReactNode;
}) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const boardChannel = supabase
      .channel(`boards:${boardId}`)
      .on('broadcast', { event: 'ticket-created' }, ({ payload }) => {
        setTickets((prev) => appendTicket(prev, payload as Ticket));
      })
      .on('broadcast', { event: 'ticket-updated' }, ({ payload }) => {
        const ticket = payload as Ticket;
        setTickets((prev) => prev.map((t) => (t.id === ticket.id ? ticket : t)));
      })
      .subscribe();

    const onInit = async () => {
      const [boardRes, ticketsRes] = await Promise.all([
        api.get<Board>(`/boards/${boardId}`),
        api.get<Ticket[]>(`/boards/${boardId}/tickets`),
      ]);
      setBoard(boardRes.data);
      setTickets(ticketsRes.data);
    };

    onInit();

    return () => {
      supabase.removeChannel(boardChannel);
    };
  }, [boardId]);

  const createTicket = async (content: string) => {
    const res = await api.post<Ticket>(`/boards/${boardId}/tickets`, { content });
    setTickets((prev) => appendTicket(prev, res.data));
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    const res = await api.patch<Ticket>(`/boards/${boardId}/tickets/${id}`, { status });
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? res.data : ticket)));
  };

  const deleteBoard = async () => {
    await api.delete(`/boards/${boardId}`);
  };

  return (
    <BoardContext.Provider
      value={{ board, tickets, createTicket, updateTicketStatus, deleteBoard }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }

  return context;
};
