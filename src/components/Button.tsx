interface ButtonProps {
  onClick: () => void;
  buttonText?: string;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, buttonText = "Pedir Ahora", type = "button", className = "", title }) => {
  return (
    <button
      title={title}
      type={type}
      className={`bg-teal-400 px-8 py-2 uppercase text-black text-lg font-bold border-2 border-dashed border-black rounded-lg transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};
