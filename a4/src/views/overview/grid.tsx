import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";
import { DayBody } from "./dayBody";
import "./grid.css";

type GridProps = {
  model: Model;
};

export function Grid({ model }: GridProps) {
  const tick = useSignal(0); // triggers re-render on model update

  useEffect(() => {
    const observer = {
      update: () => {
        tick.value++;
      },
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div className="grid">
      <div className="day-labels">
        {model.day_of_week.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>
      <div className="day-bodies">
        {model.day_of_week.map((_, index) => (
          <DayBody key={index} model={model} day={index} />
        ))}
      </div>
    </div>
  );
}
