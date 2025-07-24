import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import "./modeSwtich.css";

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
    <div class="mode-switch">
      {mode === "Overview" ? (
        <>
          <button disabled={!canUndo} onClick={() => model.undo()}>
            Undo
          </button>
          <button disabled={!canRedo} onClick={() => model.redo()}>
            Redo
          </button>
          <div class="filler" />
          <button
            disabled={selectedCount === 0}
            onClick={() => {
              model.curEvent = model.selectedEvents[0];
              model.curEventIdx = 1;
              model.setMode("Agenda");
            }}
          >
            Agenda
          </button>
        </>
      ) : (
        <button onClick={() => model.setMode("Overview")}>
          Overview
        </button>
      )}
    </div>
  );
}
