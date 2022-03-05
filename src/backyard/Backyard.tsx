import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import CreateChampionship from './views/commands/CreateChampionship';
import Dashboard from './views/Dashboard';

function Backyard() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="neues-turnier" element={<CreateChampionship />} />
      </Route>
    </Routes>
  );
}

export default Backyard;
