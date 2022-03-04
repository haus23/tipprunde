import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Backyard from './backyard/Backyard';
import FrontOfHouse from './front-of-house/FrontOfHouse';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading ...</p>}>
        <Routes>
          <Route path="/*" element={<FrontOfHouse />} />
          <Route path="/hinterhof/*" element={<Backyard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
