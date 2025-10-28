// Función para guardar el estado en localStorage
export const saveStateToLocalStorage = (state) => {
    try {
        const stateWithoutToast = {
            ...state,
            toasts: {
                ...state.toasts,
                toasts: []
            }
        };
        const serializedState = JSON.stringify(stateWithoutToast);
        localStorage.setItem('vigilaciaState', serializedState);
    } catch (err) {
        console.error("No se pudo guardar el estado en localStorage", err);
    }
};

// Función para recuperar el estado desde localStorage
export const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('vigilaciaState');
        if (serializedState === null) return undefined;
        
        const state = JSON.parse(serializedState);
        
        // Verificar si el token ha expirado (8 horas)
        if (state.auth && state.auth.token && state.auth.loginTime) {
            const EIGHT_HOURS = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
            if (Date.now() - state.auth.loginTime > EIGHT_HOURS) {
                // Token expirado, limpiar estado de autenticación
                state.auth = {
                    token: null,
                    user: true,
                    loading: false,
                    idIncidencias: null,
                    loginTime: null,
                };
            }
        }
        
        return state;
    } catch (err) {
        console.error("No se pudo recuperar el estado desde localStorage", err);
        return undefined;
    }
};

// Función para limpiar el estado del localStorage
export const clearStateFromLocalStorage = () => {
    try {
        localStorage.removeItem('vigilaciaState');
    } catch (err) {
        console.error("No se pudo limpiar el estado del localStorage", err);
    }
};