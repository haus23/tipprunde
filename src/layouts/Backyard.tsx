import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/api/hooks/use-auth';

export default function Backyard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <>
      <Link to="/">
        <h1 className="text-2xl font-semibold m-4 border-gray-300 border-b bg-indigo-300">
          runde.tips
        </h1>
      </Link>
      <Link to="/logout">Log out</Link>
      <main className="sm:mt-4 max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
