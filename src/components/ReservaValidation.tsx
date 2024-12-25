import { useState } from 'react';
import { ReservaDetalle } from './ReservaDetalle';
import { Button } from './Button';

// interface ReservaValidationProps {
//   onReservaValida: () => void;  // Callback cuando el código es válido
//   onReservaInvalida: () => void;  // Callback cuando el código no es válido
// }

export const ReservaValidation = () => {
  const [codigo, setCodigo] = useState<string>('');  // Almacena el código que se ingresa en el formulario
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);  // Activamos el envío del formulario
  };

  return (
    <div className={`${isSubmitted && 'absolute inset-0'} sm:static`}>
      <div className="relative max-w-lg w-full h-full p-6 bg-white rounded-lg shadow-lg border border-gray-100 overflow-y-auto">
        {isSubmitted && <button type='button' className='absolute top-3 right-3' onClick={() => setIsSubmitted(false)}>❌</button>}
        
        {isSubmitted ? <ReservaDetalle codigo={codigo} /> : (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verifica tu código de reserva</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Introduce tu código de reserva"
                required
                className="w-full px-4 py-3 text-lg text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button onClick={() => { }} buttonText="Verificar código" type="submit" className='w-full font-semibold text-white bg-primary hover:bg-primary-dark border-none focus:outline-none focus:ring-2 focus:ring-primary' />
            </form>
          </>
        )}
      </div>
    </div>
  );
};
