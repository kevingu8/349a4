import { h } from "preact";
import { Model } from "../model";
import { ToolBar } from "./overview/toolBar";
import { Grid } from "./overview/grid";

type Props = {
  model: Model;
};

export function Middle({ model }: Props) {
  return (
    <div class="flex flex-col w-full h-full box-border bg-white overflow-hidden">
      <ToolBar model={model} />
      <Grid model={model} />
    </div>
  );
}
