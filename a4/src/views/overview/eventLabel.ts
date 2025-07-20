import { Observer } from "../../observer";
import { Model, Event } from "../../model";
import "./eventLabel.css";

export class EventLabel implements Observer {
  private static _nextUid = 0;

  private container: HTMLDivElement;
  private checkbox: HTMLInputElement;
  private labelEl: HTMLLabelElement;

  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model, private event: Event) {
    // 1) create wrapper
    this.container = document.createElement("div");
    this.container.className = "event-label";
    this.container.style.height = `${24 * (event.end - event.start)}px`;

    // 2) checkbox + unique ID
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    const uid = `evt-${EventLabel._nextUid++}`;
    this.checkbox.id = uid;
    this.checkbox.checked = this.event.selected;
    this.container.appendChild(this.checkbox);

    // 3) label linked to that ID
    this.labelEl = document.createElement("label");
    this.labelEl.htmlFor = uid;
    this.labelEl.innerText = this.event.description;
    this.container.appendChild(this.labelEl);

    // 4) wire up interactions
    this.checkbox.addEventListener("click", () => {
      this.model.selectEvent(this.event);
      this.checkbox.checked = this.event.selected;
    });
    this.container.addEventListener("dblclick", () => {
      this.model.editEvent(this.event);
    });

    // 5) observe model for external changes
    this.model.addObserver(this);
  }

  update() {
    // you can re-sync checked state or description here if needed
    this.checkbox.checked = this.event.selected;
    this.labelEl.innerText = this.event.description;
  }
}
