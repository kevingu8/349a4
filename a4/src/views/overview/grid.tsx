import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";
import { DayBody } from "./dayBody";

type GridProps = {
  model: Model;
};

export function Grid({ model }: GridProps) {
  const tick = useSignal(0);

  useEffect(() => {
    const observer = {
      update: () => tick.value++,
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div class="flex flex-col w-full box-border border-x border-b border-black">
      <div class="flex font-semibold border-b border-black">
        {model.day_of_week.map((day, index) => (
          <div key={index} class="w-1/7 text-center px-2 py-2">
            {day}
          </div>
        ))}
      </div>
      <div class="flex w-full">
        {model.day_of_week.map((_, index) => (
          <div key={index} class="w-1/7">
            <DayBody model={model} day={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
