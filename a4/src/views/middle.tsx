import { h } from "preact";
import { Model } from "../model";
import { ToolBar } from "./overview/toolBar";
import { Grid } from "./overview/grid";
import "./middle.css";

type Props = {
  model: Model;
};

export function Middle({ model }: Props) {
  return (
    <div class="middle">
      <ToolBar model={model} />
      <Grid model={model} />
    </div>
  );
}
