import { signal } from "@preact/signals";
import { h } from "preact";

type QuantityWidgetProps = {
  counter?: number;
  min_value?: number;
  max_value?: number;
  default_count?: number;
  default_text?: string;
  mapping?: (value: number) => string;
  addEffect?: (value: number) => boolean;
  minusEffect?: (value: number) => boolean;
};

export function QuantityWidget({
  counter = 1,
  min_value = 1,
  max_value = 99,
  default_count = 0,
  default_text = "0",
  mapping = (value: number) => value.toString(),
  addEffect = () => true,
  minusEffect = () => true,
}: QuantityWidgetProps) {
  const count = signal(counter);

  const display = () => (default_text !== "0" ? default_text : mapping(count.value));

  const handleIncrement = () => {
    if (count.value < max_value && addEffect(count.value)) {
      count.value++;
    }
  };

  const handleDecrement = () => {
    if (count.value > min_value && minusEffect(count.value)) {
      count.value--;
    }
  };

  const handleReset = () => {
    count.value = default_count;
    addEffect(count.value);
  };

  return (
    <div class="flex gap-2 items-center p-2 border rounded bg-gray-100 w-max">
      <button
        class="w-8 h-8 bg-gray-200 border border-black text-lg rounded hover:bg-gray-300"
        onClick={handleIncrement}
      >
        +
      </button>
      <button
        class="w-12 h-8 bg-white border border-black text-sm rounded"
        onClick={handleReset}
      >
        {mapping(count.value)}
      </button>
      <button
        class="w-8 h-8 bg-gray-200 border border-black text-lg rounded hover:bg-gray-300"
        onClick={handleDecrement}
      >
        -
      </button>
    </div>
  );
}
