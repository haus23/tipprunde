import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root')
);
