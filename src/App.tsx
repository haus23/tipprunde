import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SplashScreen from './core/components/SplashScreen';
import Backyard from './backyard/Backyard';
import FrontOfHouse from './front-of-house/FrontOfHouse';
import RequireAuth from './core/components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SplashScreen />}>
        <Routes>
          <Route path="/*" element={<FrontOfHouse />} />
          <Route
            path="/hinterhof/*"
            element={
              <RequireAuth>
                <Backyard />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
