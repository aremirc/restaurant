/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5733', // Puedes usar un color cálido o acorde con el branding del restaurante
        'primary-dark': '#C13C22',
        secondary: '#F4A261', // Color complementario
        success: '#4CAF50', // Verde para mensajes de éxito
        error: '#FF5F57', // Rojo para mensajes de error
        'bg-light': '#FAF3E0', // Un color de fondo suave
      },
    },
  },
  plugins: [],
}
