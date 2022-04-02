import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Backyard from '@/layouts/Backyard';
import FrontOfHouse from '@/layouts/FrontOfHouse';
import Dashboard from '@/views/backyard/Dashboard';
import Home from '@/views/front-of-house/Home';
import LogIn from '@/views/front-of-house/LogIn';
import SplashScreen from '@/views/SplashScreen';

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<FrontOfHouse />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LogIn />} />
        </Route>
        <Route path="/hinterhof" element={<Backyard />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
