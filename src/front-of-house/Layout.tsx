import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <h1>runde.tipps</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
