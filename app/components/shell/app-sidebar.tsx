import { Link, useMatch } from 'react-router';

function MainNav() {
  return (
    <div>
      <div>FOH</div>
      <div>
        <Link to={'/hinterhof'}>Hinterhof</Link>
      </div>
    </div>
  );
}

function AdminNav() {
  return (
    <div>
      <div>Hinterhof</div>
      <div>
        <Link to={'/'}>Startseite</Link>
      </div>
    </div>
  );
}
export function AppSidebar() {
  const isAdmin = useMatch('/hinterhof/*');

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-zinc-100">
      <div>
        <Link to={'/'}>runde.tips</Link>
      </div>
      <div>{isAdmin ? <AdminNav /> : <MainNav />}</div>
    </div>
  );
}
