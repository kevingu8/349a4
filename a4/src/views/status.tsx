import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import "./status.css";

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
    <div class="status">
      <span>{text}</span>
    </div>
  );
}
