const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";  // Uso de variable de entorno

// Tipos para la respuesta de la API
interface ApiResponse<T> {
  data: T;
  message?: string;
  // Agrega aquí otros campos que puedas esperar de la API
}

type FetchDataOptions = {
  method?: 'GET' | 'POST';
  body?: any;               // Datos que se enviarán en el body de la solicitud.
  signal?: AbortSignal;     // Para cancelar la solicitud.
};

// Función para obtener datos de la API con cancelación de solicitud
export const fetchData = async <T>(
  endpoint: string,
  options: FetchDataOptions = {}
): Promise<ApiResponse<T> | Error | undefined> => {
  const { method = 'GET', body, signal } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',  // Siempre que envíes JSON
  };

  const requestOptions: RequestInit = {
    method,
    headers,
    signal,
    body: method === 'POST' && body ? JSON.stringify(body) : undefined, // Si es POST, agregamos el body
  };

  try {
    // Hacemos la solicitud fetch con el `AbortSignal` para manejar la cancelación
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data: T = await response.json();

    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      throw new Error("No data returned from API.");
    }

    return { data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
      return new Error(error.message);
    } else {
      console.error("Unknown error fetching data:", error);
      return new Error("Unknown error");
    }
  } finally {
    console.log("Fetch operation has finished");
  }
};