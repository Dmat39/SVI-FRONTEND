import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    loading: false,
    idIncidencias: null,
    loginTime: null,
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    moduleLoading: (state, action) => {
      state.moduleLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.idIncidencias = null;
      state.loginTime = null;
    },
    setTokenAuth: (state, action) => {
      state.token = action.payload;
      state.user = action.payload ? true : null; // Si hay token, hay usuario autenticado
      state.loginTime = Date.now(); // Guardar el tiempo de inicio de sesión
    },
    setIdIncidencias: (state, action) => {
      state.idIncidencias = action.payload;
    },
    checkTokenExpiration: (state) => {
      const EIGHT_HOURS = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
      if (state.loginTime && Date.now() - state.loginTime > EIGHT_HOURS) {
        // Token expirado, limpiar estado
        state.user = null;
        state.token = null;
        state.loading = false;
        state.idIncidencias = null;
        state.loginTime = null;
      }
    },
  }
});

export const {logout, moduleLoading, setIdIncidencias, setTokenAuth, checkTokenExpiration} = AuthSlice.actions

export default AuthSlice.reducer