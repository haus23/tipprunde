import { Route, Routes } from 'react-router-dom';
import Backyard from '@/layouts/Backyard';
import FrontOfHouse from '@/layouts/FrontOfHouse';
import Dashboard from '@/views/backyard/Dashboard';
import Home from '@/views/front-of-house/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontOfHouse />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/hinterhof" element={<Backyard />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
