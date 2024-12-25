import { useState, useEffect, useCallback } from "react";
import { fetchData } from "../services/apiService";  // Importa la función que maneja las solicitudes

// interface ApiResponse {
//   id: string;
//   name: string;
//   phone: string;
//   date: string;
// }

export const useApi = <T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
  const [data, setData] = useState<T | null>(null);      // Para almacenar los datos obtenidos
  const [loading, setLoading] = useState<boolean>(true); // Para manejar el estado de carga
  const [error, setError] = useState<string | null>(null);    // Para manejar posibles errores
  const [retryCount, setRetryCount] = useState<number>(0); // Para manejar los reintentos

  const MAX_RETRIES = 3;  // Número máximo de reintentos

  // Creamos el callback para hacer la solicitud
  const fetchDataFromApi = useCallback(async () => {
    const controller = new AbortController();  // Creamos un nuevo AbortController para cada solicitud
    const signal = controller.signal;

    if (retryCount >= MAX_RETRIES) return; // No hacer más intentos si ya alcanzamos el máximo de reintentos

    try {
      setError(null);  // Reinicia el error antes de cada intento
      setLoading(true);
      const result = await fetchData<T>(endpoint, { method, body, signal }); // Llama a la función que hace la solicitud

      // Comprobamos si el resultado es válido
      if (!(result instanceof Error)) {
        // Verificamos que result no sea undefined antes de acceder a él
        if (result?.data !== undefined) {
          setData(result.data); // Si los datos son válidos, los guardamos
        } else {
          // setError("Data is missing or empty in the API response.");
          throw new Error("Data is missing or empty in the API response.");  // Lanza un error cuando los datos están vacíos o ausentes
        }
      } else {
        // setError(result.message);
        throw new Error(result.message); // Si el resultado es un Error, lo lanzamos
      }
    } catch (err: any) {
      // Manejamos el error y los reintentos
      if (retryCount < MAX_RETRIES) {
        // Si el número de reintentos no ha alcanzado el máximo, incrementamos
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
        setError(err.message || "An error occurred while fetching data.");
      } else {
        // Si ya hemos alcanzado el máximo de reintentos, mostramos el error final
        setError(err.message || "Failed to fetch data after several retries.");
      }
    } finally {
      setLoading(false); // Cambia el estado de carga a false
    }
  }, [endpoint, method, body, retryCount]);  // Dependencia en `retryCount` y `method` para manejar los reintentos  

  useEffect(() => {
    // Si hemos alcanzado el número máximo de reintentos, no hacemos más solicitudes
    if (retryCount < MAX_RETRIES) {
      fetchDataFromApi();
    }

    // Cleanup: Aborta la solicitud si el componente se desmonta o si el endpoint cambia
    return () => {
      console.log("Cleaning up: aborting fetch request");
      // Abortamos la solicitud si el componente se desmonta o si el endpoint cambia
    };
  }, [fetchDataFromApi, retryCount]);  // Ahora la dependencia incluye retryCount, pero solo cuando es necesario

  const retryFetch = () => setRetryCount(prev => prev + 1);  // Función para reintentar la solicitud

  return { data, loading, error, retryCount, retryFetch };  // Devuelve los datos, estado de carga y errores
};
