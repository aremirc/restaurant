import { createContext, useState, ReactNode, useContext } from "react";
import { OrderItem } from "../types";

// Definir el tipo para el contexto
interface OrderContextType {
  orders: OrderItem[];
  tip: number;
  addItem: (item: OrderItem) => void;
  updateItem: (id: OrderItem["id"]) => void;
  removeItem: (id: OrderItem["id"]) => void;
  placeOrder: () => void;
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setTip: React.Dispatch<React.SetStateAction<number>>;
}

// Crear el contexto con valores iniciales
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Proveedor del contexto
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tip, setTip] = useState(0);

  const addItem = (item: OrderItem) => {
    const itemExist = orders.find((orderItem) => orderItem.id === item.id);
    if (itemExist) {
      const updateOrder = orders.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      );

      setOrders(updateOrder);
    } else {
      const newItem = { ...item, quantity: 1 };
      setOrders([...orders, newItem]);
    }
  };

  const updateItem = (id: OrderItem["id"]) => {
    const updateOrder = orders.map((orderItem) =>
      orderItem.id === id
        ? { ...orderItem, quantity: orderItem.quantity - 1 }
        : orderItem
    );

    setOrders(updateOrder);
  };

  const removeItem = (id: OrderItem["id"]) => {
    setOrders(orders.filter((item) => item.id !== id));
  };

  const placeOrder = () => {
    setOrders([]);
    setTip(0);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        tip,
        addItem,
        updateItem,
        removeItem,
        placeOrder,
        setOrders,
        setTip,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
