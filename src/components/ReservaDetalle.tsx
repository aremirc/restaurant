import { useApi } from '../hooks/useApi';

interface ApiResponse {
  message: string;
  pedido?: {
    id: number;
    cliente: {
      id: string;
      name: string;
      phone: string;
      date: string;
    };
    productos: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
      category: string;
      state: string;
      quantity: number;
    }>;
    estado: string;
    total: number;
  };
  error?: string;
}

interface ReservaDetalleProps {
  codigo: string;
}

export const ReservaDetalle: React.FC<ReservaDetalleProps> = ({ codigo }) => {

  try {
    const { data, loading, error } = useApi<ApiResponse>(`validar-reserva/${codigo}`);  // Realiza la solicitud cuando se pasa el `codigo`

    // Si la solicitud tiene éxito, mostramos los detalles de la reserva
    if (loading) {
      return <p>Cargando...</p>;
    }

    if (error) {
      return <p className="mt-4 text-lg text-center font-medium text-red-600">Código de reserva inválido. Por favor, revisa el código e intenta nuevamente.</p>;
    }

    if (data && data.pedido) {
      const { pedido } = data;

      return (
        <>
          <h3 className="mt-4 text-2xl font-semibold text-center text-green-600">¡Reserva Confirmada!</h3>

          <div className="mt-6 space-y-4">
            <p className="text-base"><strong>ID del Pedido:</strong> <span className="text-gray-800">{pedido.id}</span></p>
            <p className="text-base"><strong>Cliente:</strong> <span className="text-gray-800">{pedido.cliente.name}</span></p>
            <p className="text-base"><strong>Teléfono:</strong> <span className="text-gray-800">{pedido.cliente.phone}</span></p>
            <p className="text-base"><strong>Fecha de la Reserva:</strong> <span className="text-gray-800">{pedido.cliente.date}</span></p>
            <p className="text-base"><strong>Estado del Pedido:</strong> <span className="text-gray-800">{pedido.estado}</span></p>
            <p className="text-base font-semibold"><strong>Total:</strong> <span className="text-green-600">${pedido.total}</span></p>
          </div>

          <h4 className="mt-8 text-xl font-semibold text-gray-800">Productos en la Reserva:</h4>
          <ul className="mt-4 space-y-6">
            {pedido.productos.map((producto) => (
              <li key={producto.id} className="flex items-start space-x-6 border-b pb-4">
                <img
                  src={producto.image}
                  alt={producto.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-lg">{producto.name}</p>
                  <p className="text-sm text-gray-600">Categoría: {producto.category}</p>
                  <p className="text-sm text-gray-600">Precio: <span className="text-green-600">${producto.price}</span></p>
                  <p className="text-sm text-gray-600">Cantidad: {producto.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    }

    return <p>No se encontraron detalles para la reserva.</p>;
  } catch (error) {
    console.log('Error al verificar el código:', error);
    return <p>Hubo un error al verificar el código de reserva. Intenta nuevamente más tarde.</p>;
  }
};
