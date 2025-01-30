import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"


function isSerializedError(error: FetchBaseQueryError | SerializedError): error is SerializedError {
  return 'message' in error
}

export function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if (isSerializedError(error)) {
    return error.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.'
  }
  else if (error.status == 'FETCH_ERROR') {
    return "No fue posible establecer una conexión con el servidor. Por favor, verifica tu conexión a Internet o inténtalo nuevamente más tarde."
  }
  else if (error.status == 'PARSING_ERROR') {
    return "El servidor devolvió una respuesta inesperada. Si el problema persiste, por favor contacte al soporte técnico."
  }
  else if (error.status == 'TIMEOUT_ERROR') {
    return 'La conexión con el servidor ha demorado más de lo esperado. Esto podría ser un problema temporal en el servidor o a problemas con su conexión a Internet. Intente nuevamente en unos momentos.'
  }
  else if (error.status == 'CUSTOM_ERROR') {
    return error.error || 'Error personalizado sin mensaje específico.'
  }
  else {
    return (error.data as any).message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.'
  }
}