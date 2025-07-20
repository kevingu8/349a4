import { Observer } from "../observer";
import { ToolBar } from "./overview/toolBar";
import { Grid } from "./overview/grid";
import { Model } from "../model";
import "./middle.css"

export class Middle  implements Observer {

    toolbar: ToolBar;
    grid: Grid;

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className = "middle";

    // this.fillWidth = 1;
    // this.fillHeight = 1;
    // this.margin = 8;
    // this.border = "1px solid black";
    this.toolbar = new ToolBar(model);
    this.grid = new Grid(model);

    this.root.appendChild(this.toolbar.root);
    this.root.appendChild(this.grid.root);

    this.model.addObserver(this);
  }

  update() {}
}
