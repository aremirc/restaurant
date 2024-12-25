export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  state: boolean;
};

export type OrderItem = MenuItem & {
  quantity: number;
};