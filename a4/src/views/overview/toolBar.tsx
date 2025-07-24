import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";
import "./toolBar.css";

type ToolBarProps = {
  model: Model;
};

export function ToolBar({ model }: ToolBarProps) {
  const tick = useSignal(0); // signal to trigger rerender

  useEffect(() => {
    const observer = {
      update: () => tick.value++,
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  // 👇 Force read to trigger rerender
  const _ = tick.value;

  const allDisabled = model.numberSelectedEvents === model.numberEvents;
  const noneDisabled = model.numberSelectedEvents === 0;
  const deleteDisabled = model.numberSelectedEvents === 0;
  const addDisabled = model.numberEvents === 10;

  return (
    <div className="toolbar">
      <button disabled={allDisabled} onClick={() => model.selectAllEvents()}>
        All
      </button>
      <button disabled={noneDisabled} onClick={() => model.deselectAllEvents()}>
        None
      </button>
      <button disabled={deleteDisabled} onClick={() => model.removeSelectedEvent()}>
        Delete
      </button>
      <button disabled={addDisabled} onClick={() => model.addEvent()}>
        Add
      </button>
    </div>
  );
}
