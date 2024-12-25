import { useState } from "react";

type CopyCodeProps = {
  textToCopy: string;
  className?: string;
};

export const CopyCode = ({ textToCopy, className = "" }: CopyCodeProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Verifica si la API Clipboard está disponible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => setIsCopied(true))
        .catch((err) => console.error("Error al copiar al portapapeles:", err));
    } else {
      console.error('La API del portapapeles no está disponible.');
      setIsCopied(false);
      handleCopyFallback();
    }
  };

  const handleCopyFallback = () => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setIsCopied(true);
    console.log('Texto copiado al portapapeles usando fallback.');
  };

  return (
    <div className={`flex flex-col justify-center items-center gap-3 ${className}`}>
      <p className="text-xl font-bold text-gray-800">Código de Reserva</p>
      <div className="relative group p-3 bg-teal-100 rounded-lg text-lg font-mono text-teal-800 flex justify-center items-center gap-3">
        <span>{textToCopy}</span>

        <button
          onClick={handleCopy}
          className="p-1 rounded-lg text-white bg-teal-500 hover:bg-teal-600"
        >
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm cursor-pointer">
            <path d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path>
          </svg>
        </button>

        {/* Tooltip */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-max p-2 text-sm rounded-md text-white bg-teal-600 shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-40">
          {isCopied ? ("¡Código copiado!") : "Haz clic para copiar"}
        </div>
      </div>
    </div >
  );
};
