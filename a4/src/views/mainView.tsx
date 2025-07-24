import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import { InnerView } from "./innerView";
import { ModifyView } from "./modifyView";
import "./mainView.css";

type MainViewProps = {
  model: Model;
};

export function MainView({ model }: MainViewProps) {
  const [edit, setEdit] = useState(model.edit);

  // Subscribe to model updates
  useEffect(() => {
    const observer = {
      update: () => setEdit(model.edit),
    };
    model.addObserver(observer);

    return () => {
      model.removeObserver(observer);
    };
  }, [model]);

  return (
    <div className="main">
      <InnerView model={model} />
      {edit && <ModifyView model={model} />}
    </div>
  );
}
