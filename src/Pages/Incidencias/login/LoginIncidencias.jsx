import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { FormControl, Input, InputLabel, Paper, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { AccountCircle, Lock } from '@mui/icons-material';
import useFetch from '../../../Hooks/UseFetch.js';
import { useDispatch } from 'react-redux';
import { setIdIncidencias, setTokenAuth } from '../../../redux/slices/AuthSlice.js';
import { setToken as setAxiosToken } from '../../../Components/helpers/axiosConfig';

const LoginIncidencias = () => {
    const navigate = useNavigate();
    const { postData } = useFetch();
    const [error, setError] = useState('');
    const dispatch = useDispatch();


    const validate = values => {
        const errors = {};
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError('');
                const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT_PRUEBA}/auth/user/`, {
                    email: values.email,
                    password: values.password
                });

                // Verificar que la respuesta sea exitosa
                if (!response || !response.status) {
                    // Error en la autenticación
                    setError(
                        response?.error?.response?.data?.message ||
                        response?.error?.response?.data?.error ||
                        'Credenciales incorrectas. Por favor, verifica tu email y contraseña.'
                    );
                    return;
                }

                // Guardar token global para axios
                const token = response?.data?.token;
                if (!token) {
                    setError('Error: No se recibió token de autenticación.');
                    return;
                }

                setAxiosToken(token);
                dispatch(setTokenAuth(token));

                // Guardar datos del usuario
                const userData = response?.data?.data;
                if (!userData || !userData.user_id) {
                    setError('Error: No se recibieron datos del usuario.');
                    return;
                }

                // Guardar el user_id numérico del backend
                dispatch(setIdIncidencias(userData.user_id));

                // No es necesario navegar manualmente - PublicIncidencias se encarga de redirigir automáticamente
            } catch (error) {
                console.error('Error inesperado en login:', error);
                setError(
                    error?.message ||
                    'Error inesperado al iniciar sesión. Por favor, inténtalo de nuevo.'
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <div className="p-4 flex items-center gap-2">
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRoundedIcon sx={{ color: "#475569", width: '1.5rem', height: '1.5rem' }} />
                </IconButton>
                <h1 className="text-3xl font-bold text-slate-600">Acceso a Incidencias</h1>
            </div>
            <main className="flex flex-1 w-full overflow-hidden justify-center items-center">
                <Paper className="p-8 shadow-xl rounded-xl bg-white/80 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AccountCircle sx={{ fontSize: 40, color: 'white' }} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700">Bienvenido</h2>
                        <p className="text-slate-500 mt-2">Ingresa tus credenciales para continuar</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 animate-shake">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            <div className="relative">
                                <FormControl fullWidth variant="standard">
                                    <InputLabel
                                        htmlFor="email"
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                    >
                                        Correo electrónico
                                    </InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        required
                                        placeholder="ejemplo@correo.com"
                                        startAdornment={
                                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        }
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-sm mt-1 absolute top-full left-0">
                                            {formik.errors.email}
                                        </div>
                                    )}
                                </FormControl>
                            </div>

                            <div className="relative mt-8">
                                <FormControl fullWidth variant="standard">
                                    <InputLabel
                                        htmlFor="password"
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                    >
                                        Contraseña
                                    </InputLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        required
                                        startAdornment={
                                            <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        }
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="text-red-500 text-sm mt-1 absolute top-full left-0">
                                            {formik.errors.password}
                                        </div>
                                    )}
                                </FormControl>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className={`w-full bg-slate-600 text-white py-3 px-4 rounded-lg
                         hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 
                         focus:ring-offset-2 transition-all duration-200 ease-in-out
                         transform hover:scale-[1.02] active:scale-[0.98]
                         ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                         shadow-lg hover:shadow-xl
                         mt-8`}
                        >
                            {formik.isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                    Iniciando sesión...
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </Paper>
            </main>
        </>
    );
};

export default LoginIncidencias;
