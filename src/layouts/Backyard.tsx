import { Link, Outlet } from 'react-router-dom';

export default function Backyard() {
  return (
    <>
      <Link to="/">
        <h1 className="text-2xl font-semibold m-4 border-gray-300 border-b bg-indigo-300">
          runde.tips
        </h1>
      </Link>
      <main className="sm:mt-4 max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
