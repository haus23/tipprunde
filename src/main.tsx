import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';

// The App
import App from './App';
import './assets/styles.css';

// Bootstrap
ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root')
);
