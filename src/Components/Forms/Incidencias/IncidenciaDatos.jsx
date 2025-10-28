import React from 'react';
import { Grid, Divider, Autocomplete, TextField } from '@mui/material';

const IncidenciaDatos = ({ dataSets, formik, incidencia }) => {
    const tipoReportante = formik.values.tipo_reportante_id;

    return (
        <>
            <Grid item xs={12} sm={12} md={12} key="Datos del reportante">
                <h2 className="text-lg font-bold mt-3">Datos del reportante</h2>
                <Divider />
            </Grid>

            {/* <Grid item xs={12} sm={6} md={4} key="tipo_reportante_id">
                <Autocomplete
                    options={dataSets.tipoReportante || []}
                    loading={true}
                    value={dataSets.tipoReportante.find(opt => opt.id === formik.values.tipo_reportante_id) || null}
                    loadingText="Cargando..."
                    disabled
                    getOptionLabel={(option) =>
                        option.nombre || option.descripcion || `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` || ''
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, value) => formik.setFieldValue('tipo_reportante_id', value?.id || '')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tipo de Reportante"
                            disabled
                            size="small"
                            name="tipo_reportante_id"
                            fullWidth
                            error={formik.touched.tipo_reportante_id && Boolean(formik.errors.tipo_reportante_id)}
                            helperText={formik.touched.tipo_reportante_id && formik.errors.tipo_reportante_id}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                            }}
                        />
                    )}
                    sx={{
                        '& .MuiAutocomplete-option': { fontSize: '0.8rem' },
                    }}
                />
            </Grid> */}

            {tipoReportante === 1 && (
                <>
                    <Grid item xs={12} sm={6} md={4} key="telefono_reportante">
                        <TextField
                            label="Teléfono del Reportante"
                            size="small"
                            name="telefono_reportante"
                            type="text"
                            fullWidth
                            disabled
                            value={formik.values.telefono_reportante || null}
                            onChange={formik.handleChange}
                            error={formik.touched.telefono_reportante && Boolean(formik.errors.telefono_reportante)}
                            helperText={formik.touched.telefono_reportante && formik.errors.telefono_reportante}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} key="nombre_reportante">
                        <TextField
                            label="Nombre del Reportante"
                            size="small"
                            name="nombre_reportante"
                            type="text"
                            fullWidth
                            disabled
                            value={formik.values.nombre_reportante}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre_reportante && Boolean(formik.errors.nombre_reportante)}
                            helperText={formik.touched.nombre_reportante && formik.errors.nombre_reportante}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                            }}
                        />
                    </Grid>
                </>
            )}

            {tipoReportante === 2 && (
                <>
                    <Grid item xs={12} sm={6} md={4} key="cargo_sereno_id">
                        <Autocomplete
                            options={dataSets.cargoSereno || []}
                            loading={true}
                            value={dataSets.cargoSereno.find(opt => opt.id === formik.values.cargo_sereno_id) || null}
                            loadingText="Cargando..."
                            disabled
                            getOptionLabel={(option) =>
                                option.nombre || option.descripcion || `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` || ''
                            }
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, value) => formik.setFieldValue('cargo_sereno_id', value?.id || '')}

                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cargo del Sereno"
                                    size="small"
                                    name="cargo_sereno_id"

                                    fullWidth
                                    error={formik.touched.cargo_sereno_id && Boolean(formik.errors.cargo_sereno_id)}
                                    helperText={formik.touched.cargo_sereno_id && formik.errors.cargo_sereno_id}
                                    sx={{
                                        '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                        '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                        '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                                    }}
                                />
                            )}
                            sx={{
                                '& .MuiAutocomplete-option': { fontSize: '0.8rem' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} key="telefono_reportante">
                        <TextField
                            label="Teléfono del Reportante"
                            size="small"
                            name="telefono_reportante"
                            type="text"
                            fullWidth
                            disabled
                            value={formik.values.telefono_reportante || ''}
                            onChange={formik.handleChange}
                            error={formik.touched.telefono_reportante && Boolean(formik.errors.telefono_reportante)}
                            helperText={formik.touched.telefono_reportante && formik.errors.telefono_reportante}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} key="sereno_id">
                        <Autocomplete
                            options={dataSets.sereno || []}
                            loading={true}
                            loadingText="Cargando..."
                            getOptionLabel={(option) =>
                                option.nombre || option.descripcion || `${option.nombres} ${option.apellidoPaterno} ${option.apellidoMaterno}` || ''
                            }
                            disabled
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, value) => formik.setFieldValue('sereno_id', value?.id || '')}
                            value={dataSets.sereno.find(opt => opt.id === formik.values.sereno_id) || null}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.nombres}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ID del Sereno"
                                    size="small"
                                    name="sereno_id"
                                    fullWidth
                                    error={formik.touched.sereno_id && Boolean(formik.errors.sereno_id)}
                                    helperText={formik.touched.sereno_id && formik.errors.sereno_id}
                                    sx={{
                                        '& .MuiInputBase-input': { fontSize: '0.8rem' },
                                        '& .MuiFormHelperText-root': { fontSize: '0.7rem' },
                                        '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                                    }}
                                />
                            )}
                            sx={{
                                '& .MuiAutocomplete-option': { fontSize: '0.8rem' },
                            }}
                        />
                    </Grid>

                </>
            )}
            {tipoReportante === 4 && (
                <>
                    <Grid item xs={12} sm={6} md={4} key="medio_id">
                        <Autocomplete
                            options={dataSets.medios || []}
                            loading={true}
                            loadingText="Cargando..."
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
                    <Grid item xs={12} sm={6} md={4} key="operador_id">
                        <Autocomplete
                            options={dataSets.operadores || []}
                            loading={true}
                            loadingText="Cargando..."
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
            )}
        </>
    );
};

export default IncidenciaDatos;
