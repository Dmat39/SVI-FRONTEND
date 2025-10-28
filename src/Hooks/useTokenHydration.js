import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setToken, clearToken } from '../Components/helpers/axiosConfig';

const useTokenHydration = () => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Hidrata el token en axios si existe en el store de Redux
    if (token) {
      setToken(token);
    } else {
      // Limpia el token si no existe en el store
      clearToken();
    }
  }, [token]);
};

export default useTokenHydration;