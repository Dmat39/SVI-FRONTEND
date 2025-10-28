import { createRoot } from 'react-dom/client'
import store from './redux/store/store';
import { Provider } from 'react-redux';
import './index.css'
import ToastComponent from './Components/Popups/ToastComponent.jsx';
import AppRouter from './Router/AppRouter.jsx';
import useTokenHydration from './Hooks/useTokenHydration.js';

// Componente wrapper para manejar la hidratación del token
const AppWithTokenHydration = () => {
  useTokenHydration();
  
  return (
    <>
      <ToastComponent />
      <AppRouter />
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppWithTokenHydration />
  </Provider>
)
