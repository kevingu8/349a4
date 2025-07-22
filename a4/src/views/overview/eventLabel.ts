import { Observer } from "../../observer";
import { Model, Event } from "../../model";

export class EventLabel implements Observer {
  private static _nextUid = 0;

  private container: HTMLDivElement;
  private checkbox: HTMLInputElement;
  private labelEl: HTMLLabelElement;

  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model, private event: Event) {
    this.container = document.createElement("div");
    this.container.className =
      "flex items-center gap-2 border border-gray-300 rounded px-2 bg-white text-xs overflow-hidden";

    this.container.style.height = `${24 * (event.end - event.start)}px`;

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    const uid = `evt-${EventLabel._nextUid++}`;
    this.checkbox.id = uid;
    this.checkbox.checked = this.event.selected;
    this.checkbox.className = "w-3 h-3";

    this.labelEl = document.createElement("label");
    this.labelEl.htmlFor = uid;
    this.labelEl.innerText = this.event.description;
    this.labelEl.className = "truncate";

    this.container.appendChild(this.checkbox);
    this.container.appendChild(this.labelEl);

    this.checkbox.addEventListener("click", () => {
      this.model.selectEvent(this.event);
      this.checkbox.checked = this.event.selected;
    });

    this.container.addEventListener("dblclick", () => {
      this.model.editEvent(this.event);
    });

    this.model.addObserver(this);
  }

  update() {
    this.checkbox.checked = this.event.selected;
    this.labelEl.innerText = this.event.description;
  }
}
