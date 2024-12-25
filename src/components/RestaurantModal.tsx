import { useState } from "react";
import { ReservaForm } from "./ReservaForm";
import { useApi } from "../hooks/useApi";  // Importa el hook personalizado
import { useClient } from "../context/ClientContext";
import { Button } from "./Button";

// Define el tipo ApiResponse esperado para los datos de la API
interface ApiResponse {
  id: string;
}

type RestaurantModalProps = {
  onClose: () => void;
  onSubmit: () => void;
};

export const RestaurantModal: React.FC<RestaurantModalProps> = ({ onClose, onSubmit }) => {
  const { setClient } = useClient();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const { data, loading, error, retryCount, retryFetch } = useApi<ApiResponse>("new");

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data && name && phone) {
      setClient({ id: data.id, name, phone });
      setName("");
      setPhone("");
      onSubmit();
      onClose();
    }
  };

  if (loading) {
    return <ReservaForm onClose={onClose} title="">Loading...</ReservaForm>;
  }

  if (error) {
    return (
      <ReservaForm onClose={onClose} title="Error">
        <p>{error} ({retryCount} retries)</p><br />
        {
          !(retryCount >= 3) && (
            <button className="w-full bg-teal-500 text-white font-medium py-2 rounded-lg hover:bg-teal-600 transition-all" onClick={retryFetch}>
              Retry {retryCount}
            </button>
          )
        }
      </ReservaForm>
    );
  }

  return (
    <ReservaForm onClose={onClose} title="¡Reserva tu mesa!">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-600">Teléfono</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ingresa tu teléfono"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        <Button onClick={() => { }} buttonText="Guardar Reserva" type="submit" className="w-full bg-teal-500 text-white hover:bg-teal-600 border-none" />
      </form>
    </ReservaForm>
  );
};
