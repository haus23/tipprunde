import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Championship from './views/championship';
import CreateChampionship from './views/commands/CreateChampionship';
import CreateRound from './views/commands/CreateRound';
import Dashboard from './views/Dashboard';
import Matches from './views/matches';
import Profile from './views/profile';

function Backyard() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="neues-turnier" element={<CreateChampionship />} />
        <Route path="neue-runde" element={<CreateRound />} />
        <Route path="turnier" element={<Championship />} />
        <Route path="spiele" element={<Matches />} />
        <Route path="profil" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Backyard;
