import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";

type Props = {
  model: Model;
};

export function Status({ model }: Props) {
  const [text, setText] = useState("this is the status section");

  useEffect(() => {
    const updateText = () => {
      if (model.getMode() === "Overview") {
        if (model.numberEvents === 0) {
          setText("");
        } else if (model.numberEvents === 1) {
          setText(`${model.numberEvents} event (${model.numberSelectedEvents} selected)`);
        } else {
          if (model.numberSelectedEvents === 0) {
            setText(`${model.numberEvents} events`);
          } else {
            setText(`${model.numberEvents} events (${model.numberSelectedEvents} selected)`);
          }
        }
      } else {
        setText(`Event ${model.curEventIdx} of ${model.numberSelectedEvents}`);
      }
    };

    const observer = { update: updateText };
    model.addObserver(observer);
    updateText(); // initial render
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div class="flex items-center w-full bg-[#d3d3d3] p-[17px] box-border rounded text-[12pt] font-sans text-[#333]">
      <span class="m-0 leading-[1.2]">{text}</span>
    </div>
  );
}
