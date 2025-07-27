import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import { Middle } from "./middle";
import { ModeSwitch } from "./modeSwitch";
import { Status } from "./status";
import { AgendaView } from "./agenda/agendaview";

type Props = {
  model: Model;
};

export function InnerView({ model }: Props) {
  const [mode, setMode] = useState(model.getMode());

  useEffect(() => {
    const observer = {
      update: () => setMode(model.getMode()),
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div class="flex flex-col gap-[12px] w-full h-full box-border p-2 overflow-x-hidden">
      <div class="flex-none">
        <ModeSwitch model={model} />
      </div>

      <div class="flex-1 overflow-hidden">
        {mode === "Overview" ? (
          <Middle model={model} />
        ) : (
          <AgendaView model={model} day={0} />
        )}
      </div>

      <div class="flex-none">
        <Status model={model} />
      </div>
    </div>
  );
}
