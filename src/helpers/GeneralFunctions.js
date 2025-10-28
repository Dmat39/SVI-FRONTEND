import { SIMBOLOGIA } from "./Constants";

export function SortData(data, orderBy, orderDirection) {
    return [...data]
        .sort((a, b) => {
            // Separar orderBy por puntos para acceder a propiedades anidadas
            const orderByKeys = orderBy.split('.');

            // Acceder a las propiedades anidadas
            const aValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, a);
            const bValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, b);

            // Comprobar el orden
            if (orderDirection === 'asc') {
                return aValue < bValue ? -1 : 1;
            }
            return aValue > bValue ? -1 : 1;
        });
}

export const formatFirstNameLastName = (nombes, apellidos) => {
    const firstName = nombes?.trim().split(" ")[0];
    const lastName = apellidos?.trim().split(" ")[0];
    return `${firstName} ${lastName}`;
}

export const hasPermissionFunction = (user, permission) => {
    const hasAllAccess = user?.permissions?.includes("all_system_access");
    const hasCreatePermission = user?.permissions?.includes(`create_${permission}`);
    const hasUpdatePermission = user?.permissions?.includes(`update_${permission}`);
    const hasDeletePermission = user?.permissions?.includes(`delete_${permission}`);

    return hasAllAccess || !permission || hasCreatePermission || hasUpdatePermission || hasDeletePermission;
}

// Función para formatear la fecha
export const formatDate = (DateString) => {
    const date = new Date(DateString);

    if (isNaN(date.getTime())) {
        return false;
    }

    // Extraer los componentes de la fecha en UTC
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
};

export const FormatoEnvioFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export const findSimbologiaId = (id) => {
    return SIMBOLOGIA.find((symbol) => symbol.id === id);
}

// Función para convertir un string RGB a hexadecimal
export function rgbToHex(rgbString) {
    // Separar los valores RGB
    const rgb = rgbString.split(',').map(val => parseInt(val.trim()));

    // Convertir a formato hexadecimal y devolver
    return rgb.map(val => val.toString(16).padStart(2, '0')).join('').toUpperCase();
}