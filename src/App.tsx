import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './Home.tsx';
import { Provider } from 'react-redux';
import { store } from './store/useTimerStore.ts';
import './index.css';
import { Store, UnknownAction } from 'redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store as unknown as Store<unknown, UnknownAction>}>
      <Home />
    </Provider>
  </StrictMode>
);
