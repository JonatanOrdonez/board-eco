'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { BoardProvider, useBoard } from '@/context/BoardContext';
import { BoardItem } from '@/components/BoardItem';
import { TicketBoard } from '@/components/TicketBoard';
import { CreateTicketForm } from '@/components/CreateTicketForm';

const BoardDetails = () => {
  const { board, deleteBoard } = useBoard();
  const router = useRouter();

  if (!board) {
    return <p>Loading...</p>;
  }

  const handleDelete = async () => {
    await deleteBoard();
    router.push('/');
  };

  return (
    <>
      <BoardItem board={board} onDelete={handleDelete} />
      <CreateTicketForm />
      <TicketBoard />
    </>
  );
};

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <BoardProvider boardId={id}>
      <main className="flex flex-col gap-4 max-w-4xl mx-auto py-10 px-4">
        <BoardDetails />
      </main>
    </BoardProvider>
  );
}
