import { useEffect, useMemo, useState } from "react";
import CustomModal from "../../Modal/CustomModal";
import { Button, Grid } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import CustomSwal, { swalError } from "../../helpers/swalConfig";
import useFetch from "../../../Hooks/UseFetch.js";
import useFetchData from "../../../Hooks/UseFetchData";
import IncidenciaPropiedades from "./IncidenciaPropiedades";
import IncidenciaTipificacion from "./IncidenciaTipificacion";
import IncidenciaDatos from "./IncidenciaDatos";
import IncidenciaDetalle from "./IncidenciaDetalle.jsx";
import IncidenciaUbicacion from "./IncidenciaUbicacion";
import Loader from "../../Loader/Loader.jsx";
import { Paper, Box } from "@mui/material";
import ImageView from "./modal/ImageView.jsx";
import { incidenceApi, getToken } from "../../helpers/axiosConfig";
import heic2any from "heic2any";

// Helper function to detect if file is video
const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
  return videoExtensions.some(ext => filename.toLowerCase().includes(ext));
};

// Helper function to detect if file is HEIC
const isHeicFile = (filename) => {
  return filename && (filename.toLowerCase().includes('.heic') || filename.toLowerCase().includes('.heif'));
};

// Function to convert HEIC to JPEG
const convertHeicToJpeg = async (blob) => {
  try {
    const convertedBlob = await heic2any({
      blob: blob,
      toType: "image/jpeg",
      quality: 0.8
    });
    return convertedBlob;
  } catch (error) {
    console.error('Error converting HEIC:', error);
    return blob; // Return original blob if conversion fails
  }
};

const UpdIncidencias = ({ refreshData, Selected, open, onClose, incidencia, setModalAbierto, setListaIncidencias, onDelete }) => {

  const [openImage, setOpenImage] = useState(false)
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(true)
  const userId = useSelector((state) => state.auth.idIncidencias);
  const { patchData } = useFetch();
  const { token } = useSelector((state) => state.auth);
  const [fotoOpen, setFotoOpen] = useState(null)
  const [isCurrentItemVideo, setIsCurrentItemVideo] = useState(false)
  const [thumbUrlByPath, setThumbUrlByPath] = useState({})
  const authToken = useMemo(() => token || getToken(), [token])
  const {
    fetchUnidad,
    fetchTipoCaso,
    fetchSubTipo,
    fetchTipoReportante,
    fetchCargoSereno,
    fetchSereno,
    fetchEstados,
    fetchAgresor,
    fetchVictima,
    fetchProcesos,
    fetchSeveridad,
    fetchMedios,
    fetchSituaciones,
    fetchOperadores,
    fetchJurisdicciones,
  } = useFetchData(token);


  const [dataSets, setDataSets] = useState({
    unidad: [],
    tipoCaso: [],
    subTipo: [],
    tipoReportante: [],
    cargoSereno: [],
    sereno: [],
    estados: [],
    agresor: [],
    victima: [],
    procesos: [],
    severidad: [],
    medios: [],
    situaciones: [],
    operadores: [],
    jurisdicciones: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: incidencia.latitud,
    lng: incidencia.longitud,
  });
  const [locationLoading, setLocationLoading] = useState(false);



  useEffect(() => {

    let datasetsLocal = JSON.parse(localStorage.getItem("datasets")) || null
    if (datasetsLocal) {
      const isExpireDate = new Date() > new Date(datasetsLocal.expiryDate)
      datasetsLocal = !isExpireDate ? datasetsLocal : null
    }
    if (!datasetsLocal && open) {
      setIsLoading(true);
      Promise.all([
        fetchUnidad(),
        fetchTipoCaso(),
        fetchSubTipo(),
        fetchTipoReportante(),
        fetchCargoSereno(),
        fetchSereno(),
        fetchEstados(),
        fetchAgresor(),
        fetchVictima(),
        fetchProcesos(),
        fetchSeveridad(),
        fetchMedios(),
        fetchSituaciones(),
        fetchOperadores(),
        fetchJurisdicciones(),
      ])
        .then((responses) => {
          const datasetsFetched = {
            unidad: responses[0]?.data || [],
            tipoCaso: responses[1]?.data || [],
            subTipo: responses[2]?.data || [],
            tipoReportante: responses[3]?.data || [],
            cargoSereno: responses[4]?.data || [],
            sereno: responses[5]?.data || [],
            estados: responses[6]?.data || [],
            agresor: responses[7]?.data || [],
            victima: responses[8]?.data || [],
            procesos: responses[9]?.data || [],
            severidad: responses[10]?.data || [],
            medios: responses[11]?.data || [],
            situaciones: responses[12]?.data || [],
            operadores: responses[13]?.data || [],
            jurisdicciones: responses[14]?.data || [],

          }
          setDataSets(datasetsFetched);
          const now = new Date()
          const ttl = 2 * 24 * 60 * 60 * 1000; // 172800000 ms (2 días)
          datasetsFetched.expiryDate = new Date(now.getTime() + ttl);
          localStorage.setItem("datasets", JSON.stringify(datasetsFetched))

        })
        .catch((err) => {
          CustomSwal.fire("Error", "Error al obtener los datos.", "error");
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
    else {
      setDataSets(datasetsLocal)
    }


  }, [open]);
  useEffect(() => {

    formik.setFieldValue('situacion_id', incidencia?.situacion_id || dataSets.situaciones[1]?.id || "");
    formik.setFieldValue('genero_agresor_id', incidencia?.genero_agresor_id || dataSets.agresor[2]?.id || "");
    formik.setFieldValue('genero_victima_id', incidencia?.genero_victima_id || dataSets.victima[2]?.id || "");
    formik.setFieldValue('severidad_proceso_id', incidencia?.severidad_proceso_id || dataSets.procesos[4]?.id || "");
    formik.setFieldValue('estado_proceso_id', incidencia?.estado_proceso_id || dataSets.estados[3]?.id || "");
    formik.setFieldValue('severidad_id', incidencia?.severidad_id || dataSets.severidad[3]?.id || "");
  }, [dataSets])

  const formik = useFormik(dataSets ? {
    enableReinitialize: false,
    initialValues: {
      // unidad_id: incidencia?.unidad_id || "", // Comentado - no se usa
      tipo_caso_id: incidencia?.tipo_caso_id || "",
      sub_tipo_caso_id: incidencia?.sub_tipo_caso_id || "",
      tipo_reportante_id: incidencia?.tipo_reportante_id || "",
      telefono_reportante: incidencia?.telefono_reportante || "",
      cargo_sereno_id: incidencia?.cargo_sereno_id || "",
      nombre_reportante: incidencia?.nombre_reportante || "",
      sereno_id: incidencia?.sereno_id || "",
      direccion: incidencia?.direccion || "Cargando direcion ....",
      latitud: -11.977148,
      longitud: -76.996402,
      jurisdiccion_id: incidencia?.jurisdiccion_id || "",
      descripcion: incidencia?.descripcion || "",
      observacion: incidencia?.observacion || "",
      doneAt: incidencia?.doneAt || new Date().toISOString(),
      // fecha_registro: new Date().toLocaleDateString("es-PE", {
      //   timeZone: "America/Lima",
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit"
      // }).split("/").reverse().join("-"),
      // hora_registro: new Date().toLocaleTimeString("es-ES", {
      //   timeZone: "America/Lima",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      //   hour12: false
      // }),
      // fecha_ocurrencia: incidencia?.doneAt ? (typeof incidencia.doneAt === 'string' ? incidencia.doneAt.split('T')[0] : new Date(incidencia.doneAt).toISOString().split('T')[0]) : "",
      // hora_ocurrencia: incidencia?.doneAt ? (typeof incidencia.doneAt === 'string' ? incidencia.doneAt.split('T')[1]?.split('.')[0] || "" : new Date(incidencia.doneAt).toISOString().split('T')[1].split('.')[0]) : "",
      estado_proceso_id: incidencia?.estado_proceso_id || dataSets.estados[3]?.id || "",
      genero_agresor_id: incidencia?.genero_agresor_id || dataSets.agresor[2]?.id || "",
      genero_victima_id: incidencia?.genero_victima_id || dataSets.victima[2]?.id || "",
      severidad_proceso_id: incidencia?.severidad_proceso_id || dataSets.procesos[4]?.id || "",
      severidad_id: incidencia?.severidad_id || dataSets.severidad[3]?.id || "",
      medio_id: incidencia?.medio_id || "",
      situacion_id: incidencia?.situacion_id || dataSets.situaciones[1]?.id || "",
      operador_id: incidencia?.operador_id || "",
    },
    validate: (values) => {
      const errors = {};
      const requiredFields = [
        "tipo_caso_id",
        "sub_tipo_caso_id",
        "tipo_reportante_id",
        "jurisdiccion_id",
        "descripcion",
        "doneAt",
        "estado_proceso_id",
        "direccion",
        "severidad_proceso_id",
        "severidad_id",
        "situacion_id",
        "operador_id",
        "medio_id",
        "genero_agresor_id",
        "genero_victima_id",
        "estado_proceso_id"
      ];
      requiredFields.forEach((field) => {
        if (!values[field]) errors[field] = "Campo requerido";
      });
      if (values.direccion === "Cargando direcion ....") {
        errors.direccion = "La direccion esta cargando"
      }
      if (
        values.telefono_reportante &&
        !/^\d{9}$/.test(values.telefono_reportante)
      ) {
        errors.telefono_reportante = "Número de teléfono no válido";
      }

      if (values.descripcion && values.descripcion.length < 10) {
        errors.descripcion = "La descripción debe tener al menos 10 caracteres";
      }

      // Validación para doneAt (fecha y hora de ocurrencia)
      if (values.doneAt) {
        const doneAtDate = new Date(values.doneAt);
        if (isNaN(doneAtDate.getTime())) {
          errors.doneAt = "Fecha y hora de ocurrencia no válida";
        }
      }

      return errors;
    },
    onSubmit: (values) => {

      values.id = incidencia.id
      values.fotos = incidencia.fotos
      values.nombre_reportante = incidencia.nombre_reportante
      values.user_id = userId.toString()
      if (typeof values.latitud !== "string") values.latitud = values.latitud.toString()
      if (typeof values.longitud !== "string") values.longitud = values.longitud.toString()
      if (values.telefono_reportante === null) delete values.telefono_reportante
      handleRegistrarConfimar(values);

    },
  } : undefined);

  // Descargar miniaturas (imagenes/videos) con token
  useEffect(() => {
    let isActive = true
    const fetchThumbs = async () => {
      try {
        if (!incidencia?.fotos || incidencia.fotos.length === 0) {
          setIsLoadingThumbs(false)
          return
        }
        
        setIsLoadingThumbs(true)
        const results = await Promise.all(
          incidencia.fotos.map(async (path) => {
            try {
              const response = await incidenceApi.get(`/incidencias/fotos/${path.replace('preincidencias/fotos/', '')}`, {
                responseType: 'blob',
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
              })
              
              let finalBlob = response.data;
              
              // Convert HEIC files to JPEG
              if (isHeicFile(path)) {
                finalBlob = await convertHeicToJpeg(response.data);
              }
              
              const url = URL.createObjectURL(finalBlob)
              return [path, url]
            } catch (error) {
              console.error(`Error processing ${path}:`, error);
              return [path, null]
            }
          })
        )
        if (!isActive) return
        setThumbUrlByPath(Object.fromEntries(results))
        setIsLoadingThumbs(false)
      } catch (error) {
        console.error('Error loading thumbnails:', error);
        setIsLoadingThumbs(false)
      }
    }
    fetchThumbs()
    return () => {
      isActive = false
      Object.values(thumbUrlByPath).forEach((u) => u && URL.revokeObjectURL(u))
    }
  }, [incidencia?.fotos, authToken])

  const handleRegistrarConfimar = (values) => {
    CustomSwal.fire({
      title: '¿Seguro que quieres registrar la preincidencia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        patchData(
          `${import.meta.env.VITE_APP_ENDPOINT_PRUEBA}/incidencias/${incidencia.id}`,
          values,
          token
        )
          .then((response) => {
            if (response.status) {
              CustomSwal.fire(
                "Agregado",
                "La incidencia ha sido registrada correctamente.",
                "success"
              );
              handleClose();
              setListaIncidencias(prev => prev.filter(incidenciaElemento => incidenciaElemento.id !== incidencia.id))
              setModalAbierto(false)
            } else {
              swalError(response.errors.msg);
            }
          })
          .catch((error) => {
            console.error("Error en la solicitud:", error);
            swalError({
              message: "Error inesperado al registrar la incidencia",
              /*  data: [error.message], */
            });
          })
          .finally(() => {
            formik.setSubmitting(false);
          })
      }
    }


    ).finally(() => {
      formik.setSubmitting(false);
    })
  }

  const handleCloseImageView = () => {
    setOpenImage(false)
  }
  const handleClose = () => {
    formik.resetForm();
    // formik.setFieldValue(
    //   "fecha_registro",
    //   new Date().toISOString().split("T")[0]
    // );
    // formik.setFieldValue(
    //   "hora_registro",
    //   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    // );
    if (onClose) onClose();
  };
  const handleOpenImage = (foto) => {
    setOpenImage(true)
    setFotoOpen(foto)
    setIsCurrentItemVideo(isVideoFile(foto))
  }
  const handleReload = () => {
    setIsLoading(true);
    Promise.all([
      fetchUnidad(),
      fetchTipoCaso(),
      fetchSubTipo(),
      fetchTipoReportante(),
      fetchCargoSereno(),
      fetchSereno(),
      fetchEstados(),
      fetchAgresor(),
      fetchVictima(),
      fetchProcesos(),
      fetchSeveridad(),
      fetchMedios(),
      fetchSituaciones(),
      fetchOperadores(),
      fetchJurisdicciones(),
    ])
      .then((responses) => {

        const datasetsFetched = {
          unidad: responses[0]?.data || [],
          tipoCaso: responses[1]?.data || [],
          subTipo: responses[2]?.data || [],
          tipoReportante: responses[3]?.data || [],
          cargoSereno: responses[4]?.data || [],
          sereno: responses[5]?.data || [],
          estados: responses[6]?.data || [],
          agresor: responses[7]?.data || [],
          victima: responses[8]?.data || [],
          procesos: responses[9]?.data || [],
          severidad: responses[10]?.data || [],
          medios: responses[11]?.data || [],
          situaciones: responses[12]?.data || [],
          operadores: responses[13]?.data || [],
          jurisdicciones: responses[14]?.data || [],
        }
        setDataSets(datasetsFetched);
        const now = new Date()
        const ttl = 2 * 24 * 60 * 60 * 1000; // 172800000 ms (2 días)
        datasetsFetched.expiry = now + ttl
        localStorage.setItem("datasets", JSON.stringify(datasetsFetched))

      })
      .catch((err) => {
        CustomSwal.fire("Error", "Error al obtener los datos.", "error");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <CustomModal
        className={"max-w-4xl"}
        Open={open}
        handleClose={handleClose}
        isLoading={isLoading || formik.isSubmitting}
      >
        <div className="flex mb-2 w-full justify-between">
          <div className="flex items-center mb-2">
            <SecurityIcon className="w-6 h-6 mr-2" />
            <h1 className="text-lg font-bold">Registrar Incidencia</h1>
          </div>
          <Button variant="outlined" onClick={handleReload}>
            Recargar Datos
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <form
            key={open ? "open" : "closed"}
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-3"
          >
            <Grid container spacing={2}>
              <Grid container spacing={2} ml={0}>
                <IncidenciaTipificacion dataSets={dataSets} formik={formik} incidencia={incidencia} />
              </Grid>

              <Grid container spacing={2} ml={0}>
                <IncidenciaDatos dataSets={dataSets} formik={formik} incidencia={incidencia} />
              </Grid>

              <IncidenciaUbicacion
                dataSets={dataSets}
                formik={formik}
                markerPosition={markerPosition}
                setLocationLoading={setLocationLoading}
                incidencia={incidencia}
              />

              <Grid container spacing={2} ml={0}>
                <IncidenciaDetalle dataSets={dataSets} formik={formik} incidencia={incidencia} />
              </Grid>

              <Grid container spacing={2} ml={0}>
                <IncidenciaPropiedades dataSets={dataSets} formik={formik} incidencia={incidencia} />
              </Grid>
            </Grid>
            <div className="w-full flex flex-wrap gap-1">
              {isLoadingThumbs ? (
                // Mostrar loaders mientras cargan las miniaturas
                Array.from({ length: incidencia.fotos.length }).map((_, index) => (
                  <Box className='h-[100px] w-[90px]' key={`loader${index}`}>
                    <Paper
                      className="relative p-2 rounded-xl overflow-hidden shadow-md"
                      elevation={2}
                    >
                      <div className="w-full h-24 bg-gray-200 rounded-md flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-1"></div>
                        <span className="text-xs text-gray-500">
                          {isHeicFile(incidencia.fotos[index]) ? 'HEIC' : 'Cargando'}
                        </span>
                      </div>
                    </Paper>
                  </Box>
                ))
              ) : (
                incidencia.fotos.map((foto, index) => {
                  return (
                    <Box onClick={() => handleOpenImage(foto)} className='h-[100px] w-[90px]' key={`foto${index}`}>
                      <Paper
                        className="relative p-2 rounded-xl overflow-hidden shadow-md hover:scale-110 cursor-pointer"
                        elevation={2}
                      >
                        {isVideoFile(foto) ? (
                          <video
                            className="w-full h-24 object-cover rounded-md"
                            src={thumbUrlByPath[foto] || ''}
                            controls
                          />
                        ) : (
                          <img
                            className="w-full h-24 object-cover rounded-md"
                            src={thumbUrlByPath[foto] || ''}
                            alt="Imagen preincidencia"
                          />
                        )}
                      </Paper>
                    </Box>
                  )
                })
              )}
            </div>
            <div className="flex justify-between pt-5">
              <Button
                type="button"
                size="small"
                variant="contained"
                color="inherit"
                onClick={handleClose}
              >
                Cerrar
              </Button>
              <div className="flex gap-2">
                {onDelete && (
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      onDelete(incidencia.id);
                      handleClose();
                    }}
                    disabled={formik.isSubmitting}
                  >
                    ELIMINAR
                  </Button>
                )}
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  color="success"
                  disabled={formik.isSubmitting}
                >
                  Registrar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CustomModal>
      {(isLoading || formik.isSubmitting || locationLoading) && <Loader />}
      <ImageView open={openImage} handleClose={handleCloseImageView} foto={fotoOpen} isVideo={isCurrentItemVideo}></ImageView>
    </>
  );
};

export default UpdIncidencias;
