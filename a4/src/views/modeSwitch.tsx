import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";

type Props = {
  model: Model;
};

export function ModeSwitch({ model }: Props) {
  const [canUndo, setCanUndo] = useState(model.canUndo);
  const [canRedo, setCanRedo] = useState(model.canRedo);
  const [selectedCount, setSelectedCount] = useState(model.selectedEvents.length);
  const [mode, setMode] = useState(model.getMode());

  useEffect(() => {
    const observer = {
      update() {
        setCanUndo(model.canUndo);
        setCanRedo(model.canRedo);
        setSelectedCount(model.selectedEvents.length);
        setMode(model.getMode());
      },
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div class="flex justify-end items-center w-full h-14 bg-[#d3d3d3] px-4">
      {mode === "Overview" ? (
        <>
          <button
            disabled={!canUndo}
            onClick={() => model.undo()}
            class="px-[14px] py-[6px] mx-[4px] text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors duration-200 hover:bg-[#e6e6e6] hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            disabled={!canRedo}
            onClick={() => model.redo()}
            class="px-[14px] py-[6px] mx-[4px] text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors duration-200 hover:bg-[#e6e6e6] hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
          <div class="flex-1" />
          <button
            disabled={selectedCount === 0}
            onClick={() => {
              model.curEvent = model.selectedEvents[0];
              model.curEventIdx = 1;
              model.setMode("Agenda");
            }}
            class={`px-[14px] py-[6px] mx-[4px] text-sm border rounded cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedCount === 0
                ? "bg-white border-gray-500 text-black"
                : "hover:bg-[#e6e6e6] hover:border-gray-600 bg-white border-gray-500"
            }`}
          >
            Agenda
          </button>
        </>
      ) : (
        <button
          onClick={() => model.setMode("Overview")}
          class="px-[14px] py-[6px] mx-[4px] text-sm border border-[#357ae8] bg-[#4285f4] text-white rounded cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Overview
        </button>
      )}
    </div>
  );
}
