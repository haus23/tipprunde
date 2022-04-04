import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import SplashScreen from '@/views/SplashScreen';
import Backyard from '@/layouts/Backyard';
import FrontOfHouse from '@/layouts/FrontOfHouse';
import Dashboard from '@/views/backyard/Dashboard';
import Home from '@/views/front-of-house/Home';
import LogIn from '@/views/front-of-house/LogIn';
import LogOut from '@/views/front-of-house/LogOut';
import Experiment from '@/views/backyard/Experiment';
import CreateChampionship from '@/views/backyard/commands/CreateChampionship';

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<FrontOfHouse />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LogIn />} />
          <Route path="logout" element={<LogOut />} />
        </Route>
        <Route path="/hinterhof" element={<Backyard />}>
          <Route index element={<Dashboard />} />
          {/* Commands */}
          <Route path="neues-turnier" element={<CreateChampionship />} />
          <Route path="experiment" element={<Experiment />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
