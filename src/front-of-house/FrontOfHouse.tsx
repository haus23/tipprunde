import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Home from './views/Home';
import LogIn from './views/LogIn';

function FrontOfHouse() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    </Routes>
  );
}

export default FrontOfHouse;
