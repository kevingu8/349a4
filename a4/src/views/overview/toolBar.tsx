import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Model } from "../../model";

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

  const baseBtn =
    "px-[14px] py-[6px] text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors duration-200 " +
    "hover:enabled:bg-[#e6e6e6] hover:enabled:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed";

  const activeBtn = "bg-[#4285f4] text-white border-[#357ae8]";

  return (
    <div class="flex flex-row items-center gap-[12px] px-[16px] py-[15px] bg-[#fafafa] border border-black box-border">
      <button
        disabled={allDisabled}
        onClick={() => model.selectAllEvents()}
        class={baseBtn}
      >
        All
      </button>
      <button
        disabled={noneDisabled}
        onClick={() => model.deselectAllEvents()}
        class={baseBtn}
      >
        None
      </button>
      <button
        disabled={deleteDisabled}
        onClick={() => model.removeSelectedEvent()}
        class={baseBtn}
      >
        Delete
      </button>
      <button
        disabled={addDisabled}
        onClick={() => model.addEvent()}
        class={baseBtn}
      >
        Add
      </button>
    </div>
  );
}
