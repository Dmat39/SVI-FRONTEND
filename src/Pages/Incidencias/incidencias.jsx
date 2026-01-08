import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import ReplayIcon from '@mui/icons-material/Replay';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { io } from 'socket.io-client';
import FiltersPopover from "./FilterComponent";
import ModalIncidencia from "./Modalincidencias";
import CRUDTable from '../../Components/Table/CRUDTable';
import { setIdIncidencias } from "../../redux/slices/AuthSlice";
import { getToken } from "../../Components/helpers/axiosConfig";

import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import useFetchData from "../../Hooks/UseFetchData";

// Configurar plugins de dayjs para zona horaria
dayjs.extend(utc);
dayjs.extend(timezone);
import FetchServicePoo from "../../POO/Fetch";
import CustomSwal from "../../Components/helpers/swalConfig";
import UseUrlParamsManager from "../../Components/hooks/UseUrlParamsManager";
import { useSelector } from "react-redux";

const Incidencias = () => {
  const { token, idIncidencias } = useSelector((state) => state.auth);
  const {
    fetchSubTipo,
  } = useFetchData(token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addParams, removeParam } = UseUrlParamsManager();
  const [isLoading, setisLoading] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [listaIncidencias, setListaIncidencias] = useState([]);
  const [itemsFiltros, setItemsFiltros] = useState([]);
  const [subsectores, setSubsectores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reload, setIsReload] = useState(false)
  const [count, setCount] = useState(0)
  const socketRef = useRef(null)
  const socketIdRef = useRef(null)
  const preincidenciasRef = useRef(null)
  const subtiposRef = useRef([])
  const subsectoresRef = useRef([])
  // const { getData } = useFetch();
  const fetchService = FetchServicePoo();
  const authToken = token || getToken();
  useEffect(() => {
    fetchIncidencias(location.search || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, location.search])
  const ordenSectores = [
    "Zarate",
    "Caja De Agua",
    "La Huayrona",
    "Canto Rey",
    "Santa Elizabeth",
    "Bayovar",
    "10 De Octubre",
    "Mariscal Caceres",
  ];
  useEffect(() => {
    if (itemsFiltros.length > 0) addParams({ jurisdiccion_id: itemsFiltros.join(",") })
    else removeParam("jurisdiccion_id")
  }, [itemsFiltros])

  useEffect(() => {
    console.log('🔌 [SOCKET] Iniciando conexión al servidor:', import.meta.env.VITE_APP_ENDPOINT_PRUEBA_SOCKET);
    const socket = io(import.meta.env.VITE_APP_ENDPOINT_PRUEBA_SOCKET, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ [SOCKET] Conectado al servidor - Socket ID:', socket.id);
    })

    socket.on('connect_error', (error) => {
      console.error('❌ [SOCKET] Error de conexión:', error);
      console.log('🔄 [SOCKET] Reintentando conexión...');
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 [SOCKET] Reconectado después de', attemptNumber, 'intentos');
    })

    socket.on('reconnect_error', (error) => {
      console.error('❌ [SOCKET] Error al reintentar conexión:', error);
    })

    socket.on('reconnect_failed', () => {
      console.error('❌ [SOCKET] Falló la reconexión después de todos los intentos');
      console.log('⚠️ [SOCKET] Por favor, verifica que el servidor backend esté corriendo en:', import.meta.env.VITE_APP_ENDPOINT_PRUEBA_SOCKET);
    })

    socket.on('agregar-preincidencia', (preincidencia) => {
      console.log('🔵 [SOCKET] agregar-preincidencia - Datos recibidos:', preincidencia);
      const keys = ["id", "jurisdiccion", "direccion", "creado", "hora", "notShow"]
      const formatedData = formatData([preincidencia], subsectoresRef.current, subtiposRef.current)
      const incidenciaFormated = formatedData.map(item => Object.fromEntries(keys.map(key => [key, item[key]])))
      setCount(prev => prev + 1);
      preincidenciasRef.current = [...preincidenciasRef.current, incidenciaFormated[0]];
      setListaIncidencias(prevLista => [...prevLista, incidenciaFormated[0]]);
      console.log('✅ [SOCKET] agregar-preincidencia - Incidencia agregada correctamente');
    })

    socket.on("saludo", (data) => {
      console.log('🟢 [SOCKET] saludo - Datos recibidos:', data);
      socketIdRef.current = data.socketId
      console.log('✅ [SOCKET] saludo - Socket ID guardado:', data.socketId);
    })

    socket.on('preincidencia-eliminada', (response) => {
      console.log('🔴 [SOCKET] preincidencia-eliminada - Datos recibidos:', response);
      setCount(prev => prev - 1);
      setListaIncidencias(prevLista => prevLista.filter(incidencia => incidencia.id !== response.id));
      preincidenciasRef.current = preincidenciasRef.current.filter(incidencia => incidencia.id !== response.id);
      console.log('✅ [SOCKET] preincidencia-eliminada - Incidencia eliminada, ID:', response.id);
    })

    socket.on("disconnect", () => {
      console.log("⚫ [SOCKET] disconnect - Desconectado del servidor");
    })

    /* Muestra nuevamente las preincidencias */
    socket.on("preincidencia-cancelada", (incidencia) => {
      console.log('🟡 [SOCKET] preincidencia-cancelada - Datos recibidos:', incidencia);
      console.log('📋 [SOCKET] preincidencia-cancelada - Estado actual:', preincidenciasRef.current)
      const keys = ["id", "jurisdiccion", "direccion", "creado", "hora", "notShow"]
      const formatedData = formatData([incidencia], subsectoresRef.current, subtiposRef.current)
      const incidenciaFormated = formatedData.map(item => Object.fromEntries(keys.map(key => [key, item[key]])))
      setCount(prev => prev + 1)
      const newArray = [...preincidenciasRef.current, incidenciaFormated[0]]
      const sortedArray = [...newArray].sort((a, b) => new Date(a.notShow.createdAt) - new Date(b.notShow.createdAt));
      preincidenciasRef.current = sortedArray
      setListaIncidencias(sortedArray)
      console.log('✅ [SOCKET] preincidencia-cancelada - Incidencia restaurada a la lista');
    })

    socket.on("preincidencia-seleccionada", (response) => {
      console.log('🟣 [SOCKET] preincidencia-seleccionada - Datos recibidos:', response);
      setCount(prev => prev - 1);
      setListaIncidencias(prevLista => prevLista.filter(incidencia => incidencia.id !== response.id));
      preincidenciasRef.current = preincidenciasRef.current.filter(incidencia => incidencia.id !== response.id);
      console.log('✅ [SOCKET] preincidencia-seleccionada - Incidencia removida de la lista, ID:', response.id);
    })

    console.log('📋 [SOCKET] Resumen de eventos configurados:');
    console.log('   🔵 agregar-preincidencia - Agrega nueva incidencia a la lista');
    console.log('   🟢 saludo - Guarda el socket ID del servidor');
    console.log('   🔴 preincidencia-eliminada - Elimina incidencia de la lista');
    console.log('   ⚫ disconnect - Desconecta del servidor');
    console.log('   🟡 preincidencia-cancelada - Restaura incidencia a la lista');
    console.log('   🟣 preincidencia-seleccionada - Remueve incidencia de la lista');

    return (() => {
      console.log('🔌 [SOCKET] Desconectando y limpiando listeners...');
      if (socketRef.current) socketRef.current.disconnect();
      if (socketIdRef.current) socketIdRef.current = null
    })
  }, [])



  const fetchSubsectores = async () => {
    const response = await fetchService.getData(`${import.meta.env.VITE_APP_ENDPOINT_PRUEBA}/serenos/jurisdicciones`, authToken);
    const data = response.data.data;
    const filtrados = data.map((item) => {
      return { nombre: item.nombre, id: item.id };
    })
      .filter((item) =>
        ordenSectores.some((sector) =>
          item.nombre.toLowerCase().includes(sector.toLowerCase())
        )
      );
    setSubsectores(filtrados);
    return filtrados
  };
  useEffect(() => {
    if (searchTerm) {
      const filtered = preincidenciasRef?.current?.filter((item) =>
        filterIncidencia(item, searchTerm)
      );
      setListaIncidencias(filtered)
    }
    else setListaIncidencias(preincidenciasRef.current || [])
  }, [searchTerm])

  const fetchIncidencias = async (queryParams) => {
    const urlParams = queryParams || '';
    try {
      const url = `${import.meta.env.VITE_APP_ENDPOINT_PRUEBA
        }/incidencias/${urlParams}`;
      setisLoading(true);
      const response = await fetchService.getData(url, authToken);
      const subsectores = await fetchSubsectores()
      const subtipos = await fetchSubTipo()
      subtiposRef.current = subtipos
      subsectoresRef.current = subsectores
      if (response.status) {
        setCount(response.data.totalCount)
        const keys = ["id", "jurisdiccion", "direccion", "creado", "hora", "notShow"]
        const formatedData = formatData(response.data.data, subsectores, subtipos)
        const incidenciaFormated = formatedData.map(item => Object.fromEntries(keys.map(key => [key, item[key]])))
        preincidenciasRef.current = incidenciaFormated
        setListaIncidencias(incidenciaFormated);

      }
    } finally {
      setisLoading(false);
    }
  };
  const formatData = (data, subsectores, subtipos) => {

    return data.map(incidencia => {
      // Convertir a zona horaria de Perú
      const fechaPeruana = dayjs.utc(incidencia.createdAt);

      return {
        ...incidencia,

        creado: fechaPeruana.format("DD/MM/YYYY"),
        hora: fechaPeruana.format("HH:mm"),
        jurisdiccion: subsectores.find(
          (sector) =>
            sector.id == incidencia.jurisdiccion_id
        )?.nombre,
        notShow: {
          ...incidencia,
          urgencia: obtenerUrgencia(subtipos.data.find(subtipo => subtipo.id === incidencia.sub_tipo_caso_id).descripcion),
        },

      }
    })
  }

  const obtenerUrgencia = (descripcion) => {
    const splittedDescription = descripcion.split(/\s+/)
    const textUrgencia = splittedDescription[splittedDescription.length - 1]
    if (textUrgencia[textUrgencia.length - 1] === ")" && (textUrgencia[0] === "(")) {
      const result = textUrgencia.slice(1, -1)
      if (result === "Urgente" || result === "Medio") return result
      else return null
    }
    return null
  }

  const filterIncidencia = (incidencia, searchTerm, filter) => {
    // Verifica si el filter está definido y contiene el ID de jurisdicción
    const isInFilter =
      Array.isArray(filter) && filter.length > 0
        ? filter?.includes(Number(incidencia.jurisdiccion_id))
        : true;

    // Retorna true si pasa la búsqueda de texto Y está incluido en el filtro
    return (
      isInFilter &&
      (incidencia.jurisdiccion
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        incidencia.descripcion
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incidencia.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incidencia.tipoReportante
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incidencia.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incidencia.hora?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Update filtering logic
  /* useMemo(() => {
    const filtered = listaIncidencias.filter((item) =>
      filterIncidencia(item, searchTerm)
    );
    const sorted = filtered.sort((a, b) => {
      if (orderDirection === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
    setFilteredData(sorted);
  }, [listaIncidencias, searchTerm, orderBy, orderDirection]); */

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleView = (incidencia) => {
    setIncidenciaSeleccionada(incidencia);
    setModalAbierto(true);
  };
  const onEdit = (obj) => {
    console.log('📤 [SOCKET EMIT] select-preincidencia - Enviando datos:', { id: obj.id, user_id: idIncidencias });
    socketRef.current.emit("select-preincidencia", { id: obj.id, user_id: idIncidencias }, (response) => {
      console.log('📥 [SOCKET EMIT] select-preincidencia - Respuesta recibida:', response);
      if (response.status === "ok") {
        console.log("✅ [SOCKET EMIT] select-preincidencia - Se seleccionó correctamente la preincidencia")
      } else {
        console.log("❌ [SOCKET EMIT] select-preincidencia - Error al seleccionar")
        setIncidenciaSeleccionada({})
      }
    })
    handleView(obj.notShow)
  }
  const onDelete = (obj) => {
    handleDeleteConfimar(obj.id)
  }
  const handleDeleteConfimar = (id) => {
    CustomSwal.fire({
      title: '¿Seguro que quieres eliminar la preincidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Cerrar el modal de Detalles de la Incidencia usando el mismo flujo de cierre
        if (modalAbierto) {
          cerrarModal(id)
        } else {
          setModalAbierto(false)
          setIncidenciaSeleccionada(null)
        }
        // Emitir socket para eliminar - el listener 'preincidencia-eliminada' actualiza la UI
        console.log('📤 [SOCKET EMIT] eliminar-preincidencia - Enviando datos:', { id, user_id: idIncidencias });
        socketRef.current.emit('eliminar-preincidencia',
          { id, user_id: idIncidencias }, (response) => {
            console.log('📥 [SOCKET EMIT] eliminar-preincidencia - Respuesta recibida:', response);
            if (response.status === "ok") {
              console.log("✅ [SOCKET EMIT] eliminar-preincidencia - Se eliminó correctamente")
            } else {
              console.log("❌ [SOCKET EMIT] eliminar-preincidencia - Error al eliminar")
            }
          }
        )
      }
    })
  }

  const cerrarModal = (id) => {
    console.log('📤 [SOCKET EMIT] cancelar-preincidencia - Enviando datos:', { id, user_id: idIncidencias });
    socketRef.current.emit("cancelar-preincidencia", { id, user_id: idIncidencias }, (response) => {
      console.log('📥 [SOCKET EMIT] cancelar-preincidencia - Respuesta recibida:', response);
      if (response.status === "ok") console.log("✅ [SOCKET EMIT] cancelar-preincidencia - Preincidencia deseleccionada con éxito")
    })
    setModalAbierto(false);
    if (Object.keys(incidenciaSeleccionada).length === 0) setIsReload(prev => !prev)
    setIncidenciaSeleccionada(null);
  };
  const handleReload = () => {
    setIsReload(prev => !prev)
  }

  const handleExportToExcel = () => {
    // Preparar los datos para exportar
    const dataToExport = listaIncidencias.map((item, index) => ({
      '#': index + 1,
      'ID': item.id,
      'Jurisdicción': item.jurisdiccion,
      'Dirección': item.direccion?.props?.direccion || item.direccion,
      'Fecha Creado': item.creado,
      'Hora': item.hora,
      'Descripción': item.notShow?.descripcion || '',
      'Motivo': item.notShow?.motivo || '',
      'Tipo Reportante': item.notShow?.tipoReportante || '',
      'Urgencia': item.notShow?.urgencia || ''
    }));

    // Crear el libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidencias');

    // Generar el nombre del archivo con fecha actual
    const fechaActual = format(new Date(), 'dd-MM-yyyy_HH-mm');
    const nombreArchivo = `Incidencias_${fechaActual}.xlsx`;

    // Descargar el archivo
    XLSX.writeFile(workbook, nombreArchivo);
  }

  const DireccionText = ({ direccion }) => {
    return (
      <span className="relative inline-block cursor-pointer" >
        {direccion.length > 40 ? `${direccion.substring(0, 40)}...` : direccion}
        <span className="absolute left-1/2 mb-2 w-auto min-w-max -translate-x-1/2 rounded-md bg-black px-3 py-1 text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
          {direccion}
        </span>
      </span>
    )
  }

  return (
    <>
      <div className="p-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosNewRoundedIcon
              sx={{ color: "#475569", width: "1.5rem", height: "1.5rem" }}
            />
          </IconButton>
          <h1 className="text-3xl font-bold text-slate-600">
            Lista de Pre incidencias
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            color="error"
            onClick={() => dispatch(setIdIncidencias(null))}
            startIcon={<LogoutIcon />}
            className="hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.04)",
                borderColor: "rgb(239, 68, 68)",
              },
            }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
      <main className="flex flex-1 w-full overflow-hidden">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col flex-1 overflow-hidden">
          <div className="w-full flex justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 flex gap-1">
                Total de incidencias:
                <span className="font-bold">{listaIncidencias?.length}</span>
              </span>
              <FiltersPopover
                itemsFiltros={itemsFiltros}
                setItemsFiltros={(newFilters) => {
                  setItemsFiltros(newFilters);
                }}
                subsectores={subsectores}
              />
              <IconButton onClick={handleReload} className={isLoading ? "pointer-events-none" : "cursor-pointer "} disabled={isLoading}>
                <ReplayIcon   ></ReplayIcon>
              </IconButton>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExportToExcel}
                startIcon={<FileDownloadIcon />}
                size="small"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  padding: "6px 12px",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Exportar Excel
              </Button>
              <FormControl variant="standard" size="small">
                <InputLabel htmlFor="input-with-icon-adornment">
                  Buscar
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>
          <div className="flex-1 overflow-auto h-full">
            {/* Tabla */}
            <CRUDTable
              data={listaIncidencias.map(item => ({
                ...item,

                jurisdiccion: item.jurisdiccion,
                direccion: <DireccionText direccion={item.direccion} />,

              }))}
              onEdit={onEdit}
              loading={isLoading}
              count={count}
            >
            </CRUDTable>
          </div>
        </div>
      </main>
      <ModalIncidencia
        open={modalAbierto}
        handleClose={() => cerrarModal(incidenciaSeleccionada.id)}
        incidencia={incidenciaSeleccionada}
        setModalAbierto={setModalAbierto}
        setListaIncidencias={setListaIncidencias}
        onDelete={handleDeleteConfimar}
      />
    </>
  );
};

export default Incidencias;
