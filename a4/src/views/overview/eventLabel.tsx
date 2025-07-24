import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model, Event } from "../../model";
import "./eventLabel.css";

type EventLabelProps = {
  model: Model;
  event: Event;
};

let nextUid = 0;

export function EventLabel({ model, event }: EventLabelProps) {
  const uid = useRef(`evt-${nextUid++}`);
  const tick = useSignal(0);

  useEffect(() => {
    const observer = {
      update: () => {
        tick.value++;
      },
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  const handleCheck = () => {
    model.selectEvent(event);
    tick.value++;
  };

  const handleDoubleClick = () => {
    model.editEvent(event);
  };

  return (
    <div
      className="event-label"
      style={{ height: `${24 * (event.end - event.start)}px` }}
      onDblClick={handleDoubleClick}
    >
      <input
        id={uid.current}
        type="checkbox"
        checked={event.selected}
        onClick={handleCheck}
      />
      <label htmlFor={uid.current}>{event.description}</label>
    </div>
  );
}
