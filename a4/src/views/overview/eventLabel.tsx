import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model, Event } from "../../model";

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
      style={{ height: `${24 * (event.end - event.start)}px` }}
      onDblClick={handleDoubleClick}
      class={`relative z-10 flex items-start justify-start w-full h-full p-1 box-border border border-black rounded overflow-hidden ${
        event.selected ? "bg-[#8fbfcd]" : "bg-[#ADD8E6]"
      }`}
    >
      <input
        id={uid.current}
        type="checkbox"
        checked={event.selected}
        onClick={handleCheck}
        class="flex-none m-0 w-4 h-4"
      />
      <label
        htmlFor={uid.current}
        class="ml-[6px] text-[0.95rem] text-[#333] whitespace-nowrap overflow-hidden text-ellipsis self-start"
      >
        {event.description}
      </label>
    </div>
  );
}
