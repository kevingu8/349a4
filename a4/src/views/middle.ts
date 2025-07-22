import { Observer } from "../observer";
import { ToolBar } from "./overview/toolBar";
import { Grid } from "./overview/grid";
import { Model } from "../model";

export class Middle implements Observer {
  toolbar: ToolBar;
  grid: Grid;

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");

    // Replaces .middle
    this.container.className = `
      flex flex-col w-full h-full box-border bg-white
    `.replace(/\s+/g, " ").trim();

    this.toolbar = new ToolBar(model);
    this.grid = new Grid(model);

    // Replace .middle-toolbar
    this.toolbar.root.className = `
      flex items-center gap-2 border-b border-gray-300 pb-2 flex-none
    `.replace(/\s+/g, " ").trim();

    // Replace .middle-grid
    this.grid.root.className = `
      flex-1 overflow-auto bg-[#f9f9f9] border border-[#eee] rounded-md
    `.replace(/\s+/g, " ").trim();

    // Optional: inner padding inside grid
    Array.from(this.grid.root.children).forEach(child => {
      (child as HTMLElement).classList.add("p-2");
    });

    this.root.appendChild(this.toolbar.root);
    this.root.appendChild(this.grid.root);

    this.model.addObserver(this);
  }

  update() {}
}
