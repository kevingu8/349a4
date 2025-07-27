import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import { InnerView } from "./innerView";
import { ModifyView } from "./modifyView";

type MainViewProps = {
  model: Model;
};

export function MainView({ model }: MainViewProps) {
  const [edit, setEdit] = useState(model.edit);

  useEffect(() => {
    const observer = {
      update: () => setEdit(model.edit),
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  const sharedPanel =
    "bg-white border border-[#ddd] rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden box-border";

  return (
    <div class="w-screen h-screen overflow-x-hidden overflow-y-hidden flex flex-row flex-wrap gap-[16px] p-0 bg-[#f5f5f5] max-[600px]:flex-col">
      <div class={`${sharedPanel} flex-1 min-w-[200px]`}>
        <InnerView model={model} />
      </div>
      {edit && (
        <div class={`${sharedPanel} flex-none w-[360px] max-w-full`}>
          <ModifyView model={model} />
        </div>
      )}
    </div>
  );
}
