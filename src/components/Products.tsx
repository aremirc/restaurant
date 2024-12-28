// import { useApi } from "../hooks/useApi";
import { MenuItem } from "../types";
import { Item } from "./Item";

type MenuItemProps = {
  show: boolean;
  filteredProducts: MenuItem[];
  // addItem: (item: OrderItem) => void;
};

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
// }

export const Products = ({ show, filteredProducts }: MenuItemProps) => {
  // const { data, loading, error, retryFetch } = useApi<MenuItem>("new");

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return (
  //     <div>
  //       Error: {error}{" "}
  //       <button onClick={retryFetch}>Retry</button>
  //     </div>
  //   );
  // }

  return (
    <div className={`flex sm:w-9/12 ${show ? 'justify-normal' : 'justify-center'} flex-wrap gap-4 py-5 overflow-y-auto`}>
      {filteredProducts.map((item) => (
        <Item key={item.id} item={item} show={show} />
      ))}
    </div>
  );
};
