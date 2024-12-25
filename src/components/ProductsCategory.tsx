import { MenuItem } from "../types";

type MenuItemProps = {
  categories: MenuItem["category"][];
  onChangeCategory: (category: string) => void;
  activeCategory: string;
};

export const ProductsCategory = ({ categories, onChangeCategory, activeCategory }: MenuItemProps) => {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2"> {/* Contenedor para los botones */}
      {
        categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`p-4 sm:py-2 rounded-md ${activeCategory === category
              ? "bg-black text-white"
              : "bg-white text-black"
              }`}
            onClick={() => onChangeCategory(category)}
          >
            {category}
          </button>
        ))
      }
    </div>
  );
};
