import "./App.css";
import { useState } from "react";
import { MenuItem } from "./types";
import { productos } from "./data/data";
import { Products } from "./components/Products";
import { useClient } from "./context/ClientContext";
import { OrderProvider } from "./context/OrderContext";
import { OrderContent } from "./components/OrderContent";
import { ProductsCategory } from "./components/ProductsCategory";
import { RestaurantModal } from "./components/RestaurantModal";
import { ReservaValidation } from "./components/ReservaValidation";
import { CopyCode } from "./components/CopyCode";
import { Button } from "./components/Button";
// import Pedidos from "./components/Pedidos";

function App() {
  const { client } = useClient();

  const [showOptions, setShowOptions] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener categorías únicas de productos
  const categories = ['Todos', ...new Set(productos.map((item) => item.category))];

  // Estado para almacenar la categoría activa y los productos filtrados
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [filteredProducts, setFilteredProducts] = useState(productos);

  // Función para cambiar la categoría activa y filtrar productos
  const changeCategory = (category: MenuItem['category']) => {
    setActiveCategory(category);
    if (category === 'Todos') {
      setFilteredProducts(productos);
    } else {
      setFilteredProducts(productos.filter((item) => item.category === category));
    }
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  const handleFormSubmit = () => {
    setShowOrders(true);
  };

  const handleHideOrder = () => {
    setShowOrders(false);
  };

  return (
    <OrderProvider>
      <div className="relative h-screen flex flex-col">
        <header className="relative bg-teal-400">
          <span className="absolute top-1 left-1 bg-teal-300 text-xs p-1 rounded-md">RESTAURANTE</span>

          <h1 className="text-center text-4xl font-semibold uppercase py-5">"Fogón"</h1>

          {client.id && <CopyCode textToCopy={client.id} className="absolute top-3 right-3 hidden sm:flex flex-col-reverse" />}

          <div className={`fixed ${showOptions ? 'top-1 right-80' : 'top-1 right-0'} pr-1 z-40 transition-all sm:hidden`}>
            <button
              type="button"
              className="bg-gray-100/70 flex items-center justify-center p-2 rounded-lg shadow-sm shadow-teal-500"
              onClick={toggleOptions}
              aria-label={showOptions ? "Cerrar opciones" : "Abrir opciones"}
            >
              {showOptions ? (
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M3 5h18c.553 0 1-.447 1-1s-.447-1-1-1H3c-.553 0-1 .447-1 1s.447 1 1 1zM3 12h18c.553 0 1-.447 1-1s-.447-1-1-1H3c-.553 0-1 .447-1 1s.447 1 1 1zM3 19h18c.553 0 1-.447 1-1s-.447-1-1-1H3c-.553 0-1 .447-1 1s.447 1 1 1z" />
                </svg>
              )}
            </button>
          </div>
        </header>
        <nav className={`fixed sm:static inset-0 ${!showOptions && 'hidden'} sm:block flex justify-center items-center bg-gray-900 bg-opacity-50 z-30 transition-all  backdrop-blur-sm`}>
          <div className={`h-screen sm:h-auto w-80 sm:w-full bg-gray-200 absolute sm:static top-0 ${showOptions ? 'right-0' : '-right-80'} flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-5 px-4 py-8 sm:py-4 z-10`}>
            <div className="w-full sm:w-fit flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-5">
              {!showOrders && (
                <button
                  title="RESERVAS"
                  type="button"
                  className="w-12 h-12 bg-gradient-to-br from-orange-500/95 via-yellow-400/95 to-red-600/95 text-white rounded-full p-3 shadow-lg focus:outline-none transition-all duration-300 transform hover:scale-105 hover:shadow-xl fire-animation"
                  onClick={() => { }}>
                  🍽️
                </button>
              )}

              <h2 className="font-black text-3xl uppercase sm:hidden">{activeCategory}</h2>

              <ProductsCategory categories={categories} onChangeCategory={changeCategory} activeCategory={activeCategory} />
            </div>

            {showOrders ? (
              <>
                {showOptions && <CopyCode textToCopy={client.id} className="sm:hidden" />}
                <h2 className="text-teal-400 font-black text-3xl text-center">{client.name}</h2>
              </>
            ) : (
              <div className="flex justify-center items-center p-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl shadow-lg transition duration-300 ease-in-out hover:from-teal-300 hover:to-teal-500">
                <Button
                  onClick={handleModalOpen}
                  title="Hacer pedido"
                  className="w-60 hover:bg-teal-300 shadow-lg hover:shadow-teal-500 py-4 sm:py-2" />
              </div>
            )}
          </div>
        </nav>
        <main className="relative bg-gray-100 border border-dashed h-full w-full mx-auto flex flex-col sm:flex-row gap-5 p-5 lg:px-10 overflow-y-auto">
          {isModalOpen && <RestaurantModal onClose={handleModalClose} onSubmit={handleFormSubmit} />}

          <Products show={showOrders} filteredProducts={filteredProducts} />

          <div className="sm:w-3/12 flex">
            {showOrders ? <OrderContent onHideOrder={handleHideOrder} /> : <ReservaValidation />}
          </div>
        </main>
        <footer>
          {/* <Pedidos /> */}
        </footer>
      </div>
    </OrderProvider>
  );
}

export default App;
