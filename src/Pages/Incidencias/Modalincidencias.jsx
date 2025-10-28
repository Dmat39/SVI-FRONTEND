import  { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Continuar from "./Continuarproceso";
// import useFetch from "../../Hooks/UseFetch";
import MediaSwiper from "../../Components/Forms/Incidencias/modal/ImageSwiper";



const ModalIncidencias = ({ open, handleClose, incidencia,setModalAbierto,setListaIncidencias, onDelete }) => {
   console.log(incidencia)
  if (!incidencia) return null;

  return (
    <Modal
      open={Boolean(open)}
      onClose={handleClose}
      aria-labelledby="modal-incidencias"
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 800,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          mx: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Detalles de la Incidencia
          </Typography>
          <IconButton onClick={handleClose} size="small" edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        {Object.keys(incidencia).length > 0 ? (
          <MediaSwiper images={incidencia.fotos} />

        )
        : <p className="text-red-600">Esta incidencia ya no esta disponible</p>
      }
        
        <Box sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Descripción
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }} variant="body1">{Object.keys(incidencia).length > 0 ?incidencia.descripcion : "Esta pre incidencia ya no existe por favor recargue la pagina"}</Typography>
          
          {Object.keys(incidencia).length > 0 && incidencia.observacion && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, mt: 2 }}>
                Observación
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line" }} variant="body1">{incidencia.observacion}</Typography>
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          { Object.keys(incidencia).length > 0 && <Continuar incidencia={incidencia} setModalAbierto={setModalAbierto} setListaIncidencias={setListaIncidencias} onDelete={onDelete}/>}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalIncidencias;
