'use client';

import { BoardsProvider } from '@/context/BoardsContext';
import { CreateBoardForm } from '@/components/CreateBoardForm';
import { BoardsList } from '@/components/BoardsList';

export default function Home() {
  return (
    <BoardsProvider>
      <main className="flex flex-col gap-4 max-w-md mx-auto py-10 px-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <CreateBoardForm />
        <BoardsList />
      </main>
    </BoardsProvider>
  );
}
