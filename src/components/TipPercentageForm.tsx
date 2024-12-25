import { useOrder } from "../context/OrderContext";

const tipOptions = [
  {
    id: "tip-10",
    value: 0.1,
    label: "10%",
  },
  {
    id: "tip-40",
    value: 0.4,
    label: "40%",
  },
  {
    id: "tip-60",
    value: 0.6,
    label: "60%",
  },
];

// type TipPercentageFormProps = {
//   tip: number;
//   setTip: Dispatch<SetStateAction<number>>;
// };

export const TipPercentageForm = () => {
  const { tip, setTip } = useOrder();

  return (
    <div className="text-center"> {/* Centra el contenido de todo el div */}
      <h3 className="font-black text-2xl">Porcentaje de propina</h3>
      <form action="" className="mt-4">
        {tipOptions.map((tipOption) => (
          <div key={tipOption.id} className="flex gap-2 justify-center items-center"> {/* Centra los elementos dentro de cada contenedor */}
            <label htmlFor={tipOption.id} className="mr-2">{tipOption.label}</label>
            <input
              type="radio"
              name="tip"
              id={tipOption.id}
              value={tipOption.value}
              onChange={(e) => setTip(+e.target.value)}
              checked={tipOption.value === tip}
              className="cursor-pointer"
            />
          </div>
        ))}
      </form>
    </div>
  );
};