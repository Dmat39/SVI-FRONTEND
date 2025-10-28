import useFetch from './UseFetch';  // Asegúrate de que el hook useFetch esté en la ruta correcta
import axios from 'axios';
import { mainApi } from '../Components/helpers/axiosConfig';

// Hook personalizado para obtener empleados y roles
const useFetchData = (token) => {
    const url = import.meta.env.VITE_APP_ENDPOINT_PRUEBA;
    const { getData } = useFetch();

    // Obtener nombres de empleados    
    const fetchUnidad = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/tipificaciones/unidades/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchTipoCaso = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/tipificaciones/tipo_casos/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchSubTipo = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/tipificaciones/subtipo_casos/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchTipoReportante = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/tipificaciones/tipo_reportante/${urlParams}`, token, true);
            return{
                data: response.data.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchCargoSereno = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/serenos/cargos/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchSereno = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/serenos/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchJurisdicciones = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/serenos/jurisdicciones/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchEstados = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/informacion/estados_proceso/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchAgresor = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/informacion/genero_agresor/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchVictima = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/informacion/genero_victima/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchProcesos = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/informacion/severidad_procesos/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    const fetchSeveridad = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/informacion/severidades/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchMedios = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/procesos/medios/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    const fetchSituaciones = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/procesos/situaciones/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };
    
    const fetchOperadores = async ( urlParams = '') => {
        try {
            const response = await getData(`${url}/procesos/operadores/${urlParams}`, token, true);
            return{
                data: response.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

      const fetchImage = async (path) => {
        try {
          const response = await mainApi.get(
            `/${path}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              responseType: 'blob',
            }
          );
    
          if (!response.data) {
            throw new Error('La imagen no se pudo obtener.');
          }
          const pdfURL = URL.createObjectURL(response.data);
    
          return pdfURL;
        } catch (error) {
        //   console.error('Error al obtener la imagen:', error);
          return null;
        }
      };

    return { fetchUnidad, fetchTipoCaso, fetchSubTipo, fetchTipoReportante, fetchCargoSereno, fetchSereno, fetchEstados, fetchAgresor, fetchVictima, fetchProcesos, fetchSeveridad, fetchMedios, fetchSituaciones, fetchOperadores, fetchJurisdicciones, fetchImage };
};

export default useFetchData;
