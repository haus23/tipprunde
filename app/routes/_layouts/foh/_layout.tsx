import { Outlet } from 'react-router';
import { Header } from './header';

export default function FohLayout() {
  return (
    <div className="relative isolate min-h-svh w-full">
      <Header />
      <main className="mx-auto mt-2 max-w-4xl wide:px-6 pb-10 small:px-4">
        <Outlet />
      </main>
    </div>
  );
}
