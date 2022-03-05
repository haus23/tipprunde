import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import CreateChampionship from './views/commands/CreateChampionship';
import CreateRound from './views/commands/CreateRound';
import Dashboard from './views/Dashboard';

function Backyard() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="neues-turnier" element={<CreateChampionship />} />
        <Route path="neue-runde" element={<CreateRound />} />
      </Route>
    </Routes>
  );
}

export default Backyard;
