import { Observer } from "../../observer";
import { Model } from "../../model";
import { EventLabel } from "./eventLabel";
import "./dayBody.css"

export class DayBody implements Observer {
  constructor(private model: Model, private day: number) {

    // this.fillWidth = 1;
    // this.height = 24 * 24
    this.container = document.createElement("div");
  this.container.className = "day-body";


    this.model.addObserver(this);
  }

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  update() {
  this.root.replaceChildren();

  const todayEvents = this.model
    .getEventsByDay(this.day)
    .sort((a, b) => a.start - b.start);

  todayEvents.forEach((event, index, arr) => {
    // 1) Top padding before the very first event
    if (index === 0 && event.start > 0) {
      const topSeparator = document.createElement("div");
      topSeparator.className = "separator";
      topSeparator.style.height = `${24 * event.start}px`;
      this.root.appendChild(topSeparator);
    }

    // 2) The event itself
    const eventLabel = new EventLabel(this.model, event);
    this.root.appendChild(eventLabel.root);

    // 3) Spacer *after* this event, before the next one
    const next = arr[index + 1];
    if (next) {
      const gap = next.start - event.end;
      if (gap > 0) {
        const separator = document.createElement("div");
        separator.className = "separator";
        separator.style.height = `${24 * gap}px`;
        this.root.appendChild(separator);
      }
    }
  });
}

}
