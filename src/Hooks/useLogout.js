import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/AuthSlice';
import { clearToken } from '../Components/helpers/axiosConfig';
import { clearStateFromLocalStorage } from '../Components/helpers/localStorageUtils';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (redirectPath = '/incidencias/login') => {
    // Limpiar token de axios
    clearToken();
    
    // Limpiar estado de Redux
    dispatch(logout());
    
    // Limpiar localStorage (opcional, ya que Redux se encarga de esto automáticamente)
    // clearStateFromLocalStorage();
    
    // Redirigir al login
    navigate(redirectPath);
  };

  return handleLogout;
};

export default useLogout;