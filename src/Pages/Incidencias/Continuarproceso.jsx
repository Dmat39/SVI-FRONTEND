import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import UpdIncidencias from '../../Components/Forms/Incidencias/UpdIncidencias.jsx';
import { useSelector } from 'react-redux';
import CustomSwal from '../../Components/helpers/swalConfig';

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmClick = () => {
        onConfirm();
        handleClose();
    };

    const handleCancelClick = () => {
        onCancel();
        handleClose();
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Continuar Proceso
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                    Confirmación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '1rem' }}>
                        ¿Quieres continuar con el proceso?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2, gap: 1 }}>
                    <Button
                        onClick={handleCancelClick}
                        sx={{
                            backgroundColor: 'rgb(243, 244, 246)',
                            color: 'inherit',
                            '&:hover': {
                                backgroundColor: 'rgb(229, 231, 235)'
                            }
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmClick}
                        sx={{
                            backgroundColor: 'rgb(37, 99, 235)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgb(29, 78, 216)'
                            }
                        }}
                    >
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ExampleUsage = ({incidencia,setModalAbierto,setListaIncidencias, onDelete}) => {
    const [openUpdIncidencias, setOpenUpdIncidencias] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleConfirm = () => {
        console.log("Usuario confirmó");
        setOpenUpdIncidencias(true);
    };

    const handleCancel = () => {
        console.log("Usuario canceló");
    };

    const handleCloseUpdIncidencias = () => {
        setOpenUpdIncidencias(false);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <ConfirmationDialog
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            {openUpdIncidencias && (
                <UpdIncidencias
                    incidencia={incidencia}
                    open={openUpdIncidencias} // Controla la apertura del modal
                    refreshData={refreshData}
                    onClose={handleCloseUpdIncidencias} // Cierra el modal al terminar
                    setModalAbierto={setModalAbierto}
                    setListaIncidencias = {setListaIncidencias}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

export default ExampleUsage;