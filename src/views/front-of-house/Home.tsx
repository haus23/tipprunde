import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h2 className="px-4 text-3xl font-semibold">Haus23 Tipprunde</h2>
      <Link to="/hinterhof">Hinterhof</Link>
    </div>
  );
}
