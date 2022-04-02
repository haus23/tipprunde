import { Outlet } from 'react-router-dom';

export default function FrontOfHouse() {
  return (
    <>
      <h1 className="text-2xl font-semibold m-4 border-gray-300 border-b">
        runde.tips
      </h1>
      <main className="sm:mt-4 max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
