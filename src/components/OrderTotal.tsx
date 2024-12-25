import { useCallback } from "react";
import { useOrder } from "../context/OrderContext";

type OrderTotalProps = {
  // orders: OrderItem[];
  // tip: number;
  hideOrderWindow: () => void;
};

export const OrderTotal = ({ hideOrderWindow }: OrderTotalProps) => {
  const { orders, tip, placeOrder } = useOrder();

  const subtotal = useCallback(
    () => orders.reduce((total, item) => total + item.quantity * item.price, 0),
    [orders]
  );

  const propina = useCallback(() => subtotal() * tip, [tip, orders]);

  const total = useCallback(() => subtotal() + propina(), [tip, orders]);

  const handleSaveOrder = () => {
    hideOrderWindow();
    if (orders.length > 0) {
      setTimeout(() => {
        placeOrder();  // Limpiar la orden solo si hay órdenes
      }, 25000);
    }
  };

  return (
    <div className="text-center">
      <>
        <h2 className="font-black text-2xl mb-4">Total de pedido y propina</h2>
        <p>
          Subtotal a pagar: {""}
          <span className="font-bold">S/ {subtotal().toFixed(2)}</span>
        </p>
        <p>
          Propina: {""}
          <span className="font-bold">S/ {propina().toFixed(2)}</span>
        </p>
        <p className="text-lg">
          Total a pagar: {""}
          <span className="font-bold">S/ {total().toFixed(2)}</span>
        </p>
      </>

      <button
        type="button"
        className="w-3/4 mx-auto bg-black p-3 uppercase text-white font-bold mt-10 disabled:opacity-10 rounded-lg"
        disabled={propina() === 0}
        onClick={handleSaveOrder}
      >
        Confirmar Orden
      </button>
    </div>
  );
};
