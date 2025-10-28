import React, { useEffect, useState } from 'react';
import { Grid, TextField, Autocomplete, Divider } from '@mui/material';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const IncidenciaUbicacion = ({ dataSets, formik, markerPosition, setLocationLoading,incidencia }) => {
    const [address, setAddress] = useState('Cargando direcion ....');
    const [isManualAddress, setIsManualAddress] = useState(false);
  
    return (
        <>
            <Grid item xs={12} sm={12} md={12} key="Ubicacion de incidencia">
                <h2 className="text-lg font-bold mt-3">Ubicacion de incidencia</h2>
                <Divider />
            </Grid>

            <Grid item xs={12} sm={6} md={8} key="direccion">
                <TextField
                    label="Dirección"
                    size="small"
                    name="direccion"
                    type="text"
                    fullWidth
                    value={formik.values.direccion}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        formik.setFieldValue('direccion', e.target.value);
                    }}
                    error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                    helperText={formik.touched.direccion && formik.errors.direccion}
                    disabled={!isManualAddress}
                    sx={{
                        '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                        '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                        '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={4} key="jurisdiccion_id">
                <Autocomplete
                    options={dataSets.jurisdicciones || []}
                    getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, value) => formik.setFieldValue('jurisdiccion_id', value?.id || '')}
                    value={dataSets.jurisdicciones.find(opt => opt.id === incidencia.jurisdiccion_id) || null}
                    disabled
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Jurisdicción"
                            size="small"
                            name="jurisdiccion_id"
                            fullWidth
                            error={formik.touched.jurisdiccion_id && Boolean(formik.errors.jurisdiccion_id)}
                            helperText={formik.touched.jurisdiccion_id && formik.errors.jurisdiccion_id}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                            }}
                        />
                    )}
                    sx={{
                        '& .MuiAutocomplete-option': { fontSize: '0.8rem' }, // Ajusta el tamaño de las opciones
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <div className="h-[300px] w-full mb-4">
                    <MapContainer center={markerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <Marker position={markerPosition} />
                    </MapContainer>
                </div>
            </Grid>
        </>
    );
};

export default IncidenciaUbicacion;
