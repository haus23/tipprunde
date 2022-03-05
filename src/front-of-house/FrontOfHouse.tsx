import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Home from './views/Home';
import LogIn from './views/LogIn';
import LogOut from './views/LogOut';

function FrontOfHouse() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="logout" element={<LogOut />} />
      </Route>
    </Routes>
  );
}

export default FrontOfHouse;
