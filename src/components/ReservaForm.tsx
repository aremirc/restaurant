import { ReactNode } from "react";

type ReservaFormProps = {
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export const ReservaForm: React.FC<ReservaFormProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl w-96 p-8 shadow-xl transform transition-all scale-100 opacity-100 max-w-md text-center">
        <h2 className="text-3xl font-semibold text-teal-500 mb-5">{title}</h2>
        {children}

        <div className="absolute top-4 right-4 flex justify-center items-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-300"
          > {/* Botón de cierre del modal */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};