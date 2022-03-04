import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function Layout() {
  return (
    <>
      <Header />
      <main className="sm:mt-4 max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
