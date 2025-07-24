import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import { Middle } from "./middle";
import { ModeSwitch } from "./modeSwitch";
import { Status } from "./status";
import { AgendaView } from "./agenda/agendaview";
import "./innerView.css";

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
    <div class="inner">
      <ModeSwitch model={model} />
      {mode === "Overview" ? (
        <>
          <Middle model={model} />
          <Status model={model} />
        </>
      ) : (
        <>
          <AgendaView model={model} day={0} />
          <Status model={model} />
        </>
      )}
    </div>
  );
}
