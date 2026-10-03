export type TicketStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Board {
  id: string;
  name: string;
}

export interface CreateBoardDTO {
  name: string;
}

export interface Ticket {
  id: string;
  boardId: string;
  content: string;
  status: TicketStatus;
}

export interface CreateTicketDTO {
  boardId: string;
  content: string;
}

export interface UpdateTicketStatusDTO {
  status: TicketStatus;
}
