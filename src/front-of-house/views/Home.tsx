import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/api/hooks/use-auth';

import Button from '@/ui/atoms/Button';

function Home() {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
      <h2 className="px-4 text-3xl font-semibold">Haus23 Tipprunde</h2>
      <hr />
      <div className="px-4 text-lg">
        Hier entsteht unsere neue Tipprunde - also zumindest die
        Online-Auswertung. Bis allerdings erste Tabellenstände tatsächlich hier
        auf Abruf stehen, dauert es noch eine kleine Weile.
        <div className="mt-8 flex flex-col items-center gap-y-4">
          {isAuthenticated ? (
            <Button
              primary
              onClick={() => navigate('hinterhof')}
              className="w-40"
            >
              Zum Hinterhof
            </Button>
          ) : (
            <>
              <Button
                primary
                onClick={() => navigate('login')}
                className="w-32"
              >
                Log In
              </Button>
              <div className="text-sm text-gray-500">
                Nur für interne Zwecke
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
