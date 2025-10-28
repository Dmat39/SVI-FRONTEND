import CustomSwal from "../Components/helpers/swalConfig";
import { incidenceApi } from "../Components/helpers/axiosConfig";

// Variable global para evitar múltiples modales de autenticación
let isAuthModalShowing = false;

class FetchService {
  constructor() {}

  handleAuthError(error, lazy) {
    if (error.response && error.response.status === 401 && !lazy) {
      // Evitar mostrar múltiples modales
      if (isAuthModalShowing) {
        return { isAuthError: true, message: "Sesión expirada" };
      }

      isAuthModalShowing = true;
      CustomSwal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didClose: () => {
          isAuthModalShowing = false;
          // Limpiar localStorage y redirigir
          localStorage.removeItem('vigilaciaState');
          window.location.href = '/incidencias/login'
        }
      });
      return { isAuthError: true, message: "Sesión expirada" };
    }
    return { isAuthError: false };
  }

  handleErrorMessage(error, lazy = false) {
    const message = error.response.data;

    if (message?.data) {
      const formattedMessage = message.data
        .map((item) => `<p>${item}</p>`)
        .join("");
      CustomSwal.fire({
        icon: "error",
        title: "Siguientes errores",
        html: `
        <div class="max-h-[190px] overflow-y-auto">
          <p class="mb-4 flex justify-center" ><strong>Se encontraron los siguientes errores:</strong></p>
          ${formattedMessage}
        </div>
      `,
        customClass: {
          popup: "custom-swal-popup",
        },
      });
    }

    if (Object.hasOwn(message, "error")) {
      CustomSwal.fire({
        icon: "error",
        title: "Siguientes errores",
        text: message.error,
        customClass: {
          popup: "custom-swal-popup",
        },
      });
      return { isAuthError: true, message: "Sesión expirada" };
    }
    return { isAuthError: false };
  }

  async request(method, url, data = null, token, lazy = false) {
    try {
      const path = url.replace(import.meta.env.VITE_APP_ENDPOINT_PRUEBA, "");
      const response = await incidenceApi.request({
        method,
        url: path,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        ...(data && { data }),
      });
      return {
        data: response.data,
        status: true,
      };
    } catch (error) {
      const authError = this.handleAuthError(error, lazy);
      if (authError.isAuthError) return authError;
      const authErrrMessage = this.handleErrorMessage(error, lazy);
      if (authErrrMessage.isAuthError) return authErrrMessage;
      return {
        error,
        status: false,
      };
    }
  }

  getData(url, token, lazy = false) {
    return this.request("get", url, null, token, lazy);
  }

  postData(url, data, token, lazy = false) {
    return this.request("post", url, data, token, lazy);
  }

  patchData(url, data, token, lazy = false) {
    return this.request("patch", url, data, token, lazy);
  }

  deleteData(url, token, lazy = false) {
    return this.request("delete", url, null, token, lazy);
  }
}

function FetchServicePoo() {
  return new FetchService();
}

export default FetchServicePoo;
