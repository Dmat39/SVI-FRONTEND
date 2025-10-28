import { useState, useEffect } from "react";
import FetchServicePoo from "../POO/Fetch";
import UseUrlParamsManager from "./UseUrlParamsManager";

const useTableDataHook = (url, token, nameSocket, dataPath = "data") => {
  const fetchService = FetchServicePoo();
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getParams, removeParam ,removeParams} = UseUrlParamsManager();
  const params = getParams();

  const searchDataPath = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };


  // Fetch inicial de datos
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await fetchService.getData(url, token);
        console.log("Datos recibidos del fetch:", response.data.data);

        if (response.status) {
          const data = searchDataPath(response.data, dataPath);
          if (!params.search) {
            removeParam("search");
          }

          if (params.search) {
            const dataFiltered = data.filter(
              (item) =>
                item.nro_nc?.includes(params.search) ||
                item.numero_nc?.includes(params.search) ||
                item.usuario?.toLowerCase().includes(params.search.toLowerCase())
            );
            
            setTableData(dataFiltered || []);
            setCount(dataFiltered?.length || 0);
            return;
          }

          // Actualizar estado con datos del fetch
          setTableData(data || []);
          if(response?.data?.data?.totalCount){
            setCount(response?.data?.data?.totalCount);
          }else{
            setCount(data?.length || 0);
          }
          
        }
      } catch (error) {
        console.error("Error al traer datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token, dataPath, update, params.search]);

  const refreshData = () => {
    removeParams()
    setUpdate((prevUpdate) => !prevUpdate);
  };

  return { tableData, count, refreshData, loading };
};

export default useTableDataHook;
