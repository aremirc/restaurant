import { createContext, useState, ReactNode, useContext } from "react";

// Definir el tipo para el cliente
interface Client {
  id: string;
  name: string;
  phone: string;
}

// Definir el tipo para el contexto de cliente
interface ClientContextType {
  client: Client;
  setClient: React.Dispatch<React.SetStateAction<Client>>;
  updateClient: (name: string, phone: string) => void;
  resetClient: () => void;
}

// Crear el contexto de Cliente
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Proveedor del contexto de Cliente
interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client>({ id: "", name: "", phone: "" });

  // Actualizar la información del cliente
  const updateClient = (name: string, phone: string) => {
    setClient((prev) => ({ ...prev, name, phone }));
  };

  // Resetear la información del cliente
  const resetClient = () => {
    setClient({ id: "", name: "", phone: "" });
  };

  return (
    <ClientContext.Provider
      value={{
        client,
        setClient,
        updateClient,
        resetClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Hook personalizado para usar el contexto de Cliente
export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
