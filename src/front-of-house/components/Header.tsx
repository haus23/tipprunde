import { Link } from 'react-router-dom';
import Logo from '@/lib/components/Logo';

function Header() {
  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800 dark:shadow-none dark:border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="shrink-0 flex">
            <Link className="flex items-center" to="/">
              <Logo className="h-8" />
              <h1 className="ml-2 text-2xl font-semibold">runde.tips</h1>
            </Link>
          </div>
          <div className="flex items-center">{/* <ThemeSwitch /> */}</div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
