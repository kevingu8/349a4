import { h } from "preact";
import { useEffect, useMemo } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";
import { EventLabel } from "./eventLabel";
import "./dayBody.css";

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

    // 1. Top padding before first event
    if (i === 0 && event.start > 0) {
      renderedEvents.push(
        <div className="separator" style={{ height: `${24 * event.start}px` }} />
      );
    }

    // 2. The event itself
    renderedEvents.push(
      <EventLabel model={model} event={event} key={`${event}-${i}`} />
    );

    // 3. Spacer before the next event
    if (next) {
      const gap = next.start - event.end;
      if (gap > 0) {
        renderedEvents.push(
          <div className="separator" style={{ height: `${24 * gap}px` }} />
        );
      }
    }
  }

  return <div className="day-body">{renderedEvents}</div>;
}
