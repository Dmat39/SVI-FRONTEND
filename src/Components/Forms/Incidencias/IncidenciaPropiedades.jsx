import React from 'react';
import { Grid, Divider, Autocomplete, TextField } from '@mui/material';

const IncidenciaPropiedades = ({ dataSets, formik }) => (
    <>
        <Grid item xs={12} sm={12} md={12} key="Propiedades de incidencia">
            <h2 className="text-lg font-bold mt-3">Propiedades de incidencia</h2>
            <Divider />
        </Grid>
        <Grid item xs={12} sm={6} md={4} key="medio_id">
            <Autocomplete
                options={dataSets.medios || []}
                loading={true}
                loadingText="Cargando..."
                value={dataSets.medios.find(opt => opt.id === formik.values.medio_id) || null}
                getOptionLabel={(option) =>
                    option.nombre ||
                    option.descripcion ||
                    `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` ||
                    ''
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('medio_id', value?.id || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Medio"
                        size="small"
                        name="medio_id"
                        fullWidth
                        error={formik.touched.medio_id && Boolean(formik.errors.medio_id)}
                        helperText={formik.touched.medio_id && formik.errors.medio_id}
                        sx={{
                            '& .MuiInputBase-input': { fontSize: '0.8rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                            '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                        }}
                    />
                )}
                sx={{ '& .MuiAutocomplete-option': { fontSize: '0.8rem' } }}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4} key="situacion_id">
            <Autocomplete
                options={dataSets.situaciones || []}
                loading={true}
                loadingText="Cargando..."
                value={dataSets.situaciones.find(opt => opt.id === formik.values.situacion_id) || null}
                getOptionLabel={(option) =>
                    option.nombre ||
                    option.descripcion ||
                    `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` ||
                    ''
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('situacion_id', value?.id || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Situación"
                        size="small"
                        name="situacion_id"
                        fullWidth
                        error={formik.touched.situacion_id && Boolean(formik.errors.situacion_id)}
                        helperText={formik.touched.situacion_id && formik.errors.situacion_id}
                        sx={{
                            '& .MuiInputBase-input': { fontSize: '0.8rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                            '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                        }}
                    />
                )}
                sx={{ '& .MuiAutocomplete-option': { fontSize: '0.8rem' } }}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4} key="operador_id">
            <Autocomplete
                options={dataSets.operadores.filter(operador => {
                    return !operador.descripcion.includes("OPERADOR")
                }) || []}
                loading={true}
                loadingText="Cargando..."
                value={dataSets.operadores.find(opt => opt.id === formik.values.operador_id) || null}
                getOptionLabel={(option) =>
                    option.nombre ||
                    option.descripcion ||
                    `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` ||
                    ''
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('operador_id', value?.id || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="ID del Operador"
                        size="small"
                        name="operador_id"
                        fullWidth
                        error={formik.touched.operador_id && Boolean(formik.errors.operador_id)}
                        helperText={formik.touched.operador_id && formik.errors.operador_id}
                        sx={{
                            '& .MuiInputBase-input': { fontSize: '0.8rem' },
                            '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                            '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                        }}
                    />
                )}
                sx={{ '& .MuiAutocomplete-option': { fontSize: '0.8rem' } }}
            />
        </Grid>
    </>
);

export default IncidenciaPropiedades;
