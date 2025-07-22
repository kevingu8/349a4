import { Observer } from "../../observer";
import { Model } from "../../model";

export class ToolBar implements Observer {
  allButton = document.createElement("button");
  noneButton = document.createElement("button");
  deleteButton = document.createElement("button");
  addButton = document.createElement("button");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className =
      "flex flex-row items-center gap-3 p-4 bg-neutral-50 border border-black box-border";

    this.allButton.innerText = "All";
    this.noneButton.innerText = "None";
    this.deleteButton.innerText = "Delete";
    this.addButton.innerText = "Add";

    for (const btn of [
      this.allButton,
      this.noneButton,
      this.deleteButton,
      this.addButton,
    ]) {
      btn.className =
        "px-3 py-1 text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    }

    this.root.appendChild(this.allButton);
    this.root.appendChild(this.noneButton);
    this.root.appendChild(this.deleteButton);
    this.root.appendChild(this.addButton);

    // Controllers
    this.allButton.addEventListener("click", () => {
      this.model.selectAllEvents();
    });

    this.noneButton.addEventListener("click", () => {
      this.model.deselectAllEvents();
    });

    this.deleteButton.addEventListener("click", () => {
      this.model.removeSelectedEvent();
    });

    this.addButton.addEventListener("click", () => {
      this.model.addEvent();
    });

    this.model.addObserver(this);
  }

  update() {
    this.deleteButton.disabled = !(this.model.numberSelectedEvents > 0);
    this.allButton.disabled =
      this.model.numberSelectedEvents === this.model.numberEvents;
    this.noneButton.disabled = this.model.numberSelectedEvents === 0;
    this.addButton.disabled = this.model.numberEvents === 10;
  }
}
