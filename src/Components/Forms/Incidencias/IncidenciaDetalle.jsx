import React from 'react';
import { Grid, Divider, Autocomplete, TextField } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Configurar plugins de dayjs para zona horaria
dayjs.extend(utc);
dayjs.extend(timezone);

const IncidenciaDetalle = ({ dataSets, formik }) => (

    <>
        <Grid item xs={12} sm={12} md={12} key="Detalle de incidencia">
            <h2 className="text-lg font-bold mt-3">Detalle de incidencia</h2>
            <Divider />
        </Grid>

        <Grid item xs={12} sm={12} md={12} key="descripcion">
            <TextField
                label="Descripción"
                size="small"
                type="text"
                multiline
                rows={10}
                fullWidth
                value={formik.values.descripcion || ""}
                onChange={(event, value) => {
                    formik.setFieldValue("descripcion", event.target.value);
                }}
                error={false}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
                sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                    '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                }} />
        </Grid>

        {/* <Grid item xs={12} sm={12} md={12} key="observacion">
            <TextField
                label="Observación"
                size="small"
                type="text"
                multiline
                rows={4}
                fullWidth
                value={formik.values.observacion || ""}
                onChange={(event,value)=> { 
                    formik.setFieldValue("observacion", event.target.value);
                }}
                error={false}
                helperText={formik.touched.observacion && formik.errors.observacion}
                sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                    '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                }} />
        </Grid> */}
        {/* Campos de fecha y hora de registro comentados - el backend los maneja automáticamente */}
        {/* <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Fecha de Registro"
                size="small"
                name="fecha_registro"
                type="date"
                fullWidth
                value={formik.values.fecha_registro}
                onChange={formik.handleChange}
                error={formik.touched.fecha_registro && Boolean(formik.errors.fecha_registro)}
                helperText={formik.touched.fecha_registro && formik.errors.fecha_registro}
                sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                }}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Hora de Registro"
                size="small"
                name="hora_registro"
                type="time"
                fullWidth
                value={formik.values.hora_registro}
                onChange={formik.handleChange}
                error={formik.touched.hora_registro && Boolean(formik.errors.hora_registro)}
                helperText={formik.touched.hora_registro && formik.errors.hora_registro}
                sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' },
                    '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                }}
            />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} key="fecha_ocurrencia">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Fecha de Ocurrencia"
                    value={formik.values.doneAt ? dayjs.utc(formik.values.doneAt) : null}
                    onChange={(date) => {
                        if (date) {
                            const currentTime = formik.values.doneAt ? dayjs.utc(formik.values.doneAt).format('HH:mm:ss') : '00:00:00';
                            formik.setFieldValue('doneAt', `${date.format('YYYY-MM-DD')}T${currentTime}`);
                        }
                    }}
                    format='DD/MM/YYYY'
                    slotProps={{
                        textField: {
                            size: 'small',
                            fullWidth: true,
                            error: formik.touched.fecha_ocurrencia && Boolean(formik.errors.fecha_ocurrencia),
                            helperText: formik.touched.fecha_ocurrencia && formik.errors.fecha_ocurrencia,
                            sx: {
                                '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                            }
                        }
                    }}
                />
            </LocalizationProvider>

        </Grid>
        <Grid item xs={12} sm={6} md={4} key="hora_ocurrencia">
            <TextField
                label="Hora de Ocurrencia"
                size="small"
                name="hora_ocurrencia"
                type="time"
                fullWidth
                value={formik.values.doneAt ? dayjs.utc(formik.values.doneAt).format('HH:mm') : ''}
                onChange={(e) => {
                    const currentDate = formik.values.doneAt ? dayjs.utc(formik.values.doneAt).format('YYYY-MM-DD') : dayjs.utc().format('YYYY-MM-DD');
                    formik.setFieldValue('doneAt', `${currentDate}T${e.target.value}:00`);
                }}
                error={formik.touched.doneAt && Boolean(formik.errors.doneAt)}
                helperText={formik.touched.doneAt && formik.errors.doneAt}
                sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem' }, // Ajusta el tamaño del texto del input
                    '& .MuiFormHelperText-root': { fontSize: '0.7rem' }, // Ajusta el tamaño del texto de ayuda
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' } // Ajusta el tamaño del label
                }} />
        </Grid>

        <Grid item xs={12} sm={6} md={4} key="estado_proceso_id">
            <Autocomplete
                options={dataSets.estados || []}
                loading={true}
                loadingText="Cargando..."
                getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('estado_proceso_id', value?.id || '')}
                value={dataSets.estados.find(opt => opt.id === formik.values.estado_proceso_id) || dataSets.estados[3] || null}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Estado del Proceso"
                        size="small"
                        name="estado_proceso_id"
                        fullWidth
                        error={formik.touched.estado_proceso_id && Boolean(formik.errors.estado_proceso_id)}
                        helperText={formik.touched.estado_proceso_id && formik.errors.estado_proceso_id}
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

        <Grid item xs={12} sm={6} md={4} key="genero_agresor_id">
            <Autocomplete
                options={dataSets.agresor || []}
                loading={true}
                loadingText="Cargando..."
                value={dataSets.agresor.find(opt => opt.id === formik.values.genero_agresor_id) || dataSets.agresor[2] || null}
                getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => {
                    formik.setFieldValue('genero_agresor_id', value?.id || '')
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Género del Agresor"
                        size="small"
                        name="genero_agresor_id"
                        fullWidth
                        error={formik.touched.genero_agresor_id && Boolean(formik.errors.genero_agresor_id)}
                        helperText={formik.touched.genero_agresor_id && formik.errors.genero_agresor_id}
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

        <Grid item xs={12} sm={6} md={4} key="genero_victima_id">
            <Autocomplete
                options={dataSets.victima || []}
                loading={true}
                loadingText="Cargando..."
                getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('genero_victima_id', value?.id || '')}
                value={dataSets.victima.find(opt => opt.id === formik.values.genero_victima_id) || dataSets.agresor[2] || null}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Género de la Víctima"
                        size="small"
                        name="genero_victima_id"
                        fullWidth
                        error={formik.touched.genero_victima_id && Boolean(formik.errors.genero_victima_id)}
                        helperText={formik.touched.genero_victima_id && formik.errors.genero_victima_id}
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

        <Grid item xs={12} sm={6} md={4} key="severidad_proceso_id">
            <Autocomplete
                options={dataSets.procesos || []}
                loading={true}
                loadingText="Cargando..."
                getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => formik.setFieldValue('severidad_proceso_id', value?.id || '')}
                value={dataSets.procesos.find(opt => opt.id === formik.values.severidad_proceso_id) || null}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Severidad del Proceso"
                        size="small"
                        name="severidad_proceso_id"
                        fullWidth
                        error={formik.touched.severidad_proceso_id && Boolean(formik.errors.severidad_proceso_id)}
                        helperText={formik.touched.severidad_proceso_id && formik.errors.severidad_proceso_id}
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

        <Grid item xs={12} sm={6} md={4} key="severidad_id">
            <Autocomplete
                options={dataSets.severidad || []}
                loading={true}
                loadingText="Cargando..."
                getOptionLabel={(option) => option.nombre || option.descripcion || option.nombres + ' ' + option.apellidoPaterno + ' ' + option.apellidoMaterno || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={dataSets.severidad.find(opt => opt.id === formik.values.severidad_id) || null}
                onChange={(event, value) => formik.setFieldValue('severidad_id', value?.id || '')}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Severidad"
                        size="small"
                        name="severidad_id"
                        fullWidth
                        error={formik.touched.severidad_id && Boolean(formik.errors.severidad_id)}
                        helperText={formik.touched.severidad_id && formik.errors.severidad_id}
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
    </>
);

export default IncidenciaDetalle;