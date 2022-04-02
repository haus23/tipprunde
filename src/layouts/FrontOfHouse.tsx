import { Outlet } from 'react-router-dom';
import FoHHeader from '@/layouts/components/FoHHeader';

export default function FrontOfHouse() {
  return (
    <>
      <FoHHeader />
      <main className="sm:mt-4 max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
