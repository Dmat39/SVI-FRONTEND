import { useDispatch, useSelector } from 'react-redux';
import CustomSwal from '../Components/helpers/swalConfig';
import { moduleLoading, logout } from '../redux/slices/AuthSlice';
import { incidenceApi } from '../Components/helpers/axiosConfig';
import useLogout from './useLogout';

// Variable global para evitar múltiples modales de autenticación
let isAuthModalShowing = false;

function useFetch() {
  const dispatch = useDispatch()
  const handleLogout = useLogout()
  const token = useSelector((state) => state.auth.token);

  const handleAuthError = (error, lazy) => {
    if (error.response && error.response.status === 401 && !lazy) {
      // Si no hay token, es un error de login (credenciales incorrectas)
      // No hacer logout ni mostrar modal, solo retornar el error
      if (!token) {
        return { isAuthError: false } // Dejar que el componente maneje el error
      }

      // Evitar mostrar múltiples modales
      if (isAuthModalShowing) {
        return { isAuthError: true, message: 'Sesión expirada' }
      }

      // Si hay token pero retorna 401, es sesión expirada
      isAuthModalShowing = true;
      CustomSwal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didClose: () => {
          isAuthModalShowing = false;
          dispatch(logout());
          handleLogout('/incidencias/login')
        }
      })
      return { isAuthError: true, message: 'Sesión expirada' }
    }
    return { isAuthError: false }
  }

  const getData = async (url, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await incidenceApi.get(url.replace(import.meta.env.VITE_APP_ENDPOINT_PRUEBA, ''), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {

      const authError = handleAuthError(error, lazy)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }

  }

  const postData = async (url, data, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const base = url.includes(import.meta.env.VITE_APP_ENDPOINT_PRUEBA)
        ? incidenceApi
        : incidenceApi;
      const path = url.replace(import.meta.env.VITE_APP_ENDPOINT_PRUEBA, '');
      const response = await base.post(path, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }

  const patchData = async (url, data, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const base = url.includes(import.meta.env.VITE_APP_ENDPOINT_PRUEBA)
        ? incidenceApi
        : incidenceApi;
      const path = url.replace(import.meta.env.VITE_APP_ENDPOINT_PRUEBA, '');
      const response = await base.patch(path, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }


  return { getData, postData, patchData }
}

export default useFetch