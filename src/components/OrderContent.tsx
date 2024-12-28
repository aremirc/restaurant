import { useState } from "react";
import { TipPercentageForm } from "./TipPercentageForm";
import { OrderTotal } from "./OrderTotal";
import { ReservaConfirmation } from "./ReservaConfirmation";
import { useOrder } from "../context/OrderContext";

type OrderContentProps = {
  // orders: OrderItem[];
  // updateItem: (id: MenuItem["id"]) => void;
  // removeItem: (id: MenuItem["id"]) => void;
  // tip: number;
  // setTip: Dispatch<SetStateAction<number>>;
  onHideOrder: () => void;
};

export const OrderContent = ({ onHideOrder }: OrderContentProps) => {
  const { addItem, updateItem, removeItem, orders } = useOrder();

  const [modalSuccess, setModalSuccess] = useState(false);  // Nuevo estado para la confirmación
  const [isExpanded, setIsExpanded] = useState(false);  // Estado para controlar la expansión

  const handleModalClose = () => {
    onHideOrder();
    setModalSuccess(false);
  }

  const handleTimerShow = () => {
    if (!modalSuccess) {  // Evitar que se ejecute nuevamente si ya está visible
      setModalSuccess(true);  // Muestra el modal de respuesta
      setTimeout(() => {
        handleModalClose();
      }, 25000);
    }
  };

  // Función para alternar la expansión
  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <>
      <div
        className={`w-full sm:static ${isExpanded ? 'absolute inset-0' : 'hidden'} sm:block bg-gray-100 flex flex-col items-center border border-dashed border-slate-300 p-5 rounded-lg space-y-10 overflow-y-auto z-10`} // Expansión condicional
      >
        {orders.length ? (
          <>
            <div className="w-full max-w-md">
              <h2 className="font-black text-4xl">Resumen <br /> del Pedido</h2>
              <div className="space-y-3 mt-10">
                {orders.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border border-gray-200 p-5 last-of-type:border-b">
                    <img
                      className="w-28 h-28 object-cover rounded-lg"
                      src={item.image}
                      alt=""
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-lg font-bold">
                          {item.name}
                        </p>
                        <p className="text-gray-400">Notes: None <br /> Size: Normal</p>
                      </div>
                      <p className="font-bold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <button
                        className="bg-red-600 h-8 w-8 rounded-full text-white font-black border border-dashed"
                        onClick={() => removeItem(item.id)}
                      >❌</button>

                      <div className="relative">
                        {item.quantity > 1 && (
                          <button
                            className="absolute top-1.5 left-0 -translate-x-5 h-5 w-5 text-xs"
                            onClick={() => updateItem(item.id)}
                          >➖</button>
                        )}
                        <span className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-black">{item.quantity}</span>
                        <button
                          className="absolute top-1.5 right-0 translate-x-5 h-5 w-5 text-xs"
                          onClick={() => addItem(item)}
                        >➕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <TipPercentageForm />
            <OrderTotal hideOrderWindow={handleTimerShow} />
          </>
        ) : (
          <p className="font-medium text-center uppercase">Aún no has ordenado</p>
        )}
      </div>

      <div className="absolute top-2 right-2 sm:hidden z-20">
        <button type="button" className="bg-teal-300 hover:bg-teal-400 p-2 rounded-full" onClick={toggleExpansion}> {/* Botón para alternar expansión */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor"></rect>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor"></line>
            <path d="M6 17h12M8 21h8" stroke="currentColor"></path>
          </svg>
        </button>
      </div>

      {/* Mostrar la confirmación de la reserva una vez la orden sea generada */}
      {modalSuccess && <ReservaConfirmation onClose={handleModalClose} />}
    </>
  );
};
