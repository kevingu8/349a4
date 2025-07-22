import { Observer } from "../observer";
import { Model } from "../model";

export class Status implements Observer {
  label = document.createElement("span");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className =
      "flex items-center w-full bg-gray-200 px-4 py-3 rounded text-sm text-gray-800 font-sans";

    this.label.innerText = "this is the status section";

    this.root.appendChild(this.label);
    this.model.addObserver(this);
  }

  update() {
    if (this.model.getMode() === "Overview") {
      if (this.model.numberEvents === 0) {
        this.label.innerText = "";
      } else if (this.model.numberEvents === 1) {
        this.label.innerText = `${this.model.numberEvents} event (${this.model.numberSelectedEvents} selected)`;
      } else {
        if (this.model.numberSelectedEvents === 0) {
          this.label.innerText = `${this.model.numberEvents} events`;
        } else {
          this.label.innerText = `${this.model.numberEvents} events (${this.model.numberSelectedEvents} selected)`;
        }
      }
    } else {
      this.label.innerText = `Event ${this.model.curEventIdx} of ${this.model.numberSelectedEvents}`;
    }
  }
}
