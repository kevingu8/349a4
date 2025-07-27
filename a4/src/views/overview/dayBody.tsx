import { h } from "preact";
import { useEffect, useMemo } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";
import { EventLabel } from "./eventLabel";

type DayBodyProps = {
  model: Model;
  day: number;
};

export function DayBody({ model, day }: DayBodyProps) {
  const tick = useSignal(0); // used to trigger re-render

  useEffect(() => {
    const observer = {
      update: () => {
        tick.value++;
      },
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  const events = useMemo(() => {
    return model.getEventsByDay(day).sort((a, b) => a.start - b.start);
  }, [tick.value]);

  const renderedEvents = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const next = events[i + 1];

    if (i === 0 && event.start > 0) {
      renderedEvents.push(
        <div
          class="w-full bg-white flex-shrink-0"
          style={{ height: `${24 * event.start}px` }}
        />
      );
    }

    renderedEvents.push(
      <EventLabel model={model} event={event} key={`${event}-${i}`} />
    );

    if (next) {
      const gap = next.start - event.end;
      if (gap > 0) {
        renderedEvents.push(
          <div
            class="w-full bg-white flex-shrink-0"
            style={{ height: `${24 * gap}px` }}
          />
        );
      }
    }
  }

  return (
    <div
      class="relative flex flex-col w-full h-[576px] box-border bg-white border border-[#eee] rounded overflow-y-auto before:absolute before:inset-0 before:pointer-events-none before:z-0"
      style={{
        // This is applied to the `::before` pseudo-element
        "--tw-before-bg": `repeating-linear-gradient(to bottom, transparent, transparent 23px, #ddd 23px, #ddd 24px)`,
        backgroundImage: "var(--tw-before-bg)",
      }}
    >
      {/* Rendered events on top of gridlines */}
      <div class="relative z-10">{renderedEvents}</div>
    </div>
  );
}
