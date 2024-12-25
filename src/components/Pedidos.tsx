import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { OrderItem } from '../types';

interface Cliente {
  id: string;
  name: string;
  phone: string;
}

interface Pedido {
  cliente: Cliente;
  productos: OrderItem[];
  estado: string;
}

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [visiblePedidos, setVisiblePedidos] = useState<Pedido[]>([]);  // Para controlar la cantidad de pedidos visibles
  const [showMore, setShowMore] = useState(false); // Para mostrar más pedidos

  // Crear la conexión con Socket.IO
  useEffect(() => {
    const socket: Socket = io('http://localhost:4000');

    // Escuchar los nuevos pedidos emitidos por el servidor
    socket.on('nuevo-pedido', (pedido: Pedido) => {
      setPedidos((prevPedidos) => {
        // Verificar si el pedido ya existe basándonos en un identificador único del cliente
        if (!prevPedidos.some((p) => p.cliente.id === pedido.cliente.id)) {
          return [...prevPedidos, pedido];  // Si no existe, agregarlo
        }
        return prevPedidos;  // Si ya existe, no hacer nada
      });
    });

    return () => {
      socket.off('nuevo-pedido');
    };
  }, []);

  useEffect(() => {
    const limit = 5;  // Número de pedidos visibles por defecto
    setVisiblePedidos(pedidos.slice(0, limit));
    setShowMore(pedidos.length > limit);
  }, [pedidos]);

  const handleShowMore = () => {
    const limit = visiblePedidos.length + 5;  // Aumentar la cantidad visible de pedidos
    setVisiblePedidos(pedidos.slice(0, limit));
    setShowMore(pedidos.length > limit);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-fit flex flex-col items-center py-5">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg px-5 py-4 space-y-2">
        <div className='flex justify-between items-center'>
          <h2 className="text-base font-semibold text-gray-700">Pedidos Recientes (Tiempo Real)</h2>

          {/* Botón para cargar más pedidos */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-fit px-3 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg transition transform hover:scale-105 hover:shadow-xl"
            >
              Cargar más
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <ul className="flex space-x-4">
            {visiblePedidos.map((pedido) => (
              <li
                key={pedido.cliente.id}
                className="flex-shrink-0 bg-gray-100 rounded-lg p-4 shadow-lg w-40 h-auto flex flex-col justify-between items-center space-y-3"
              >
                <span className="text-sm text-gray-600">{pedido.estado}</span>
                <span className="text-lg font-medium text-gray-800">{pedido.cliente.name}</span>
                <div className="text-xs text-gray-500">{pedido.productos.length} productos</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
