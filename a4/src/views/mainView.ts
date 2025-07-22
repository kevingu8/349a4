import { Observer } from "../observer";
import { Model } from "../model";
import { InnerView } from "./innerView";
import { ModifyView } from "./modifyView";

export class MainView implements Observer {
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");

    // Replaces .main
    this.container.className = `
      flex flex-row flex-wrap w-full h-full gap-4 p-4 box-border bg-[#f5f5f5]
      max-[600px]:flex-col
    `.replace(/\s+/g, " ").trim();

    // Initial render
    this.root.appendChild(this.buildInner());
    this.model.addObserver(this);
  }

  update() {
    this.root.replaceChildren();

    this.root.appendChild(this.buildInner());

    if (this.model.edit) {
      const modify = new ModifyView(this.model).root;
      modify.className = `
        bg-white border border-gray-300 rounded-md shadow-sm
        flex-none w-[360px] max-w-full overflow-auto box-border
        max-[600px]:w-full
      `.replace(/\s+/g, " ").trim();
      this.root.appendChild(modify);
    }
  }

  private buildInner(): HTMLDivElement {
    const inner = new InnerView(this.model).root;
    inner.className = `
      bg-white border border-gray-300 rounded-md shadow-sm
      flex-1 min-w-[200px] overflow-auto box-border
    `.replace(/\s+/g, " ").trim();
    return inner;
  }
}
