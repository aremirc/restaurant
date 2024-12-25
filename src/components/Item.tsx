import { useOrder } from "../context/OrderContext";
import { MenuItem, OrderItem } from "../types";

type MenuItemProps = {
  item: MenuItem;
  // addItem: (item: OrderItem) => void;
  show: boolean;
};

export const Item = ({ item, show }: MenuItemProps) => {
  const { orders, addItem } = useOrder();

  const producto = orders.find(p => p.id === item.id);

  const itemProduct: OrderItem = { ...item, quantity: producto ? producto.quantity : 0 }

  return (
    <div className={`w-[162px] sm:w-64 ${show ? 'sm:h-72' : 'h-56'} bg-white p-3 rounded-xl flex flex-col justify-between gap-2 sm:gap-4 shadow-lg`}>
      <div className="relative rounded-lg overflow-clip">
        <img
          className="object-cover h-32 sm:h-40 w-full"
          src={itemProduct.image}
          alt=""
        />
        <span className="absolute top-3 right-3 bg-white/75 text-sm p-1 rounded-lg">
          {itemProduct.state ? "🟢 Disponible" : "🔴 No disponible"}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h3 className="font-semibold">{itemProduct.name}</h3>
        <p className="font-black">S/ {itemProduct.price}</p>
      </div>
      {show && (
        <button
          type="button"
          onClick={() => addItem(itemProduct)}
          disabled={!itemProduct.state} // Desactiva el botón si no está activo
          className={`h-10 sm:h-auto text-xs sm:text-base sm:mt-2 p-2 sm:px-5 rounded-lg ${itemProduct.quantity > 0
            ? "bg-teal-500 text-black"
            : !itemProduct.state
              ? "bg-gray-400 text-white"
              : "bg-black text-white"
            } cursor-${itemProduct.state ? "pointer" : "not-allowed"} transition-all duration-300 hover:scale-105`}
        >
          {itemProduct.quantity > 0
            ? `Agregar Otra Vez ( ${itemProduct.quantity} )`
            : itemProduct.state
              ? "+ Agregar al Carrito"
              : "❌ Disponible Pronto"}
        </button>
      )}
    </div>
  );
};
