import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Tailwind
import 'tailwindcss/tailwind.css';

// App
import App from '@/App';
import { RecoilRoot } from 'recoil';

createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>
);
