import { useState, useEffect, useMemo } from "react";
import { useApi } from "../hooks/useApi";
import { ReservaForm } from "./ReservaForm";
import ReactQRCode from 'react-qr-code';
import { OrderItem } from "../types";
import { useOrder } from "../context/OrderContext";
import { useClient } from "../context/ClientContext";
import { CopyCode } from "./CopyCode";

interface ApiResponse {
  message: string;
  reservation: string;
}

interface Cliente {
  id: string;
  name: string;
  phone: string; // Teléfono del cliente
}

interface Pedido {
  cliente: Cliente;
  productos: OrderItem[];
  estado: string;
}

type ReservaConfirmationProps = {
  onClose: () => void;
};

export const ReservaConfirmation = ({ onClose }: ReservaConfirmationProps) => {
  const { client } = useClient();
  const { orders, placeOrder } = useOrder();

  const [countdown, setCountdown] = useState(25);

  const pedido: Pedido = useMemo(() => ({
    cliente: client,
    productos: orders,
    estado: 'En preparación',
  }), [client, orders]); // Solo se vuelve a crear cuando client o orders cambian

  const { data, loading, error } = useApi<ApiResponse>(client.id, 'POST', pedido);

  // Iniciar el contador de autocierre
  useEffect(() => {
    if (countdown <= 0) return;

    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]); // Solo depende de countdown

  const handleClose = () => {
    onClose();
    if (orders.length > 0) {
      placeOrder();  // Limpiar la orden solo si hay órdenes
    }
  }

  // Mostrar el mensaje de autocierre
  const countdownMessage = countdown > 0 ? `Cerrando en ${countdown}s` : "Modal cerrado";

  if (loading) {
    return <ReservaForm onClose={handleClose} title="">Loading...</ReservaForm>;
  }

  if (error) {
    return <ReservaForm onClose={onClose} title="Error">{error}</ReservaForm>;
  }

  if (data) {
    // Crear el mensaje para WhatsApp
    const whatsappMessage = `¡Hola ${client.name}! Tu código de reserva es: ${data.reservation}.`;

    // Crear el enlace para WhatsApp
    const whatsappUrl = `https://wa.me/${client.phone}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <ReservaForm onClose={handleClose} title={data.message}>
        <div className="space-y-4">
          <CopyCode textToCopy={data.reservation} />

          {/* Mostrar el código QR */}
          <div className="mb-6 flex flex-col justify-center items-center">
            <h3>Tu código de reserva:</h3>
            <ReactQRCode value={data.reservation} size={200} aria-label={`Código de reserva: ${data.reservation}`} />
          </div>

          {/* Contador de autocierre */}
          <p className="mt-4 text-xl font-semibold text-red-500 transition-colors ease-in-out">{countdownMessage}</p>

          {/* Botón para enviar por WhatsApp */}
          <div className="mt-4 flex justify-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium p-2 rounded-lg flex items-center gap-2">
                <svg viewBox="0 0 31 30" height="30" className="icon-sm" fill="none"><title>wa-logo</title><path d="M30.3139 14.3245C30.174 10.4932 28.5594 6.864 25.8073 4.1948C23.0552 1.52559 19.3784 0.0227244 15.5446 4.10118e-06H15.4722C12.8904 -0.00191309 10.3527 0.668375 8.10857 1.94491C5.86449 3.22145 3.99142 5.06026 2.67367 7.28039C1.35592 9.50053 0.6389 12.0255 0.593155 14.6068C0.547411 17.1882 1.17452 19.737 2.41278 22.0024L1.09794 29.8703C1.0958 29.8865 1.09712 29.9029 1.10182 29.9185C1.10651 29.9341 1.11448 29.9485 1.12518 29.9607C1.13588 29.973 1.14907 29.9828 1.16387 29.9896C1.17867 29.9964 1.19475 29.9999 1.21103 30H1.23365L9.01561 28.269C11.0263 29.2344 13.2282 29.7353 15.4586 29.7346C15.6004 29.7346 15.7421 29.7346 15.8838 29.7346C17.8458 29.6786 19.7773 29.2346 21.5667 28.4282C23.3562 27.6218 24.9682 26.469 26.3098 25.0363C27.6514 23.6036 28.696 21.9194 29.3832 20.0809C30.0704 18.2423 30.3867 16.2859 30.3139 14.3245ZM15.8099 27.1487C15.6923 27.1487 15.5747 27.1487 15.4586 27.1487C13.4874 27.1511 11.5444 26.6795 9.79366 25.7735L9.39559 25.5654L4.11815 26.8124L5.09221 21.4732L4.86604 21.0902C3.78579 19.2484 3.20393 17.157 3.17778 15.0219C3.15163 12.8869 3.68208 10.7819 4.71689 8.91419C5.75171 7.0465 7.25518 5.48059 9.07924 4.37067C10.9033 3.26076 12.985 2.64514 15.1194 2.58444C15.238 2.58444 15.3571 2.58444 15.4767 2.58444C18.6992 2.59399 21.7889 3.86908 24.0802 6.13498C26.3715 8.40087 27.681 11.4762 27.7265 14.6984C27.7719 17.9205 26.5498 21.0316 24.3234 23.3612C22.0969 25.6909 19.0444 27.0527 15.8235 27.1532L15.8099 27.1487Z" fill="currentColor"></path><path d="M10.2894 7.69007C10.1057 7.69366 9.92456 7.73407 9.75673 7.80892C9.5889 7.88377 9.43779 7.99154 9.31236 8.12584C8.95801 8.48923 7.96736 9.36377 7.91006 11.2003C7.85277 13.0369 9.13594 14.8538 9.31537 15.1086C9.49481 15.3635 11.7686 19.3306 15.5141 20.9395C17.7156 21.8879 18.6806 22.0507 19.3063 22.0507C19.5642 22.0507 19.7587 22.0236 19.9622 22.0115C20.6483 21.9693 22.1969 21.1762 22.5346 20.3137C22.8724 19.4512 22.895 18.6973 22.806 18.5465C22.7171 18.3957 22.4728 18.2872 22.1049 18.0942C21.737 17.9012 19.9321 16.9361 19.5928 16.8004C19.467 16.7419 19.3316 16.7066 19.1932 16.6964C19.1031 16.7011 19.0155 16.7278 18.938 16.774C18.8605 16.8203 18.7954 16.8847 18.7484 16.9618C18.4469 17.3372 17.7548 18.153 17.5225 18.3882C17.4718 18.4466 17.4093 18.4938 17.3392 18.5265C17.2691 18.5592 17.1928 18.5768 17.1154 18.5782C16.9728 18.5719 16.8333 18.5344 16.7068 18.4681C15.6135 18.0038 14.6167 17.339 13.768 16.5079C12.975 15.7263 12.3022 14.8315 11.7716 13.8526C11.5666 13.4726 11.7716 13.2766 11.9586 13.0987C12.1456 12.9208 12.3461 12.675 12.5391 12.4624C12.6975 12.2808 12.8295 12.0777 12.9312 11.8593C12.9838 11.7578 13.0104 11.6449 13.0085 11.5307C13.0067 11.4165 12.9765 11.3045 12.9206 11.2048C12.8317 11.0149 12.1667 9.14664 11.8546 8.39725C11.6013 7.75642 11.2997 7.73531 11.0358 7.7157C10.8187 7.70062 10.5699 7.69309 10.3211 7.68555H10.2894" fill="currentColor"></path></svg>
                Enviar a WhatsApp
              </button>
            </a>
          </div>
        </div>
      </ReservaForm>
    );
  }

  return null;
};