import { Observer } from "../../observer";
import { Model } from "../../model";
import { EventLabel } from "./eventLabel";

export class DayBody implements Observer {
  private container: HTMLDivElement;

  constructor(private model: Model, private day: number) {
    this.container = document.createElement("div");

    // Full height with hour lines every 24px
    this.container.className = `
      flex flex-col w-full h-full box-border relative overflow-y-auto
      border-r last:border-r-0
    `.replace(/\s+/g, " ").trim();

    this.container.style.backgroundImage =
      "repeating-linear-gradient(to bottom, transparent, transparent 23px, #ddd 23px, #ddd 24px)";
    this.container.style.position = "relative";

    this.model.addObserver(this);
  }

  get root(): HTMLDivElement {
    return this.container;
  }

  update() {
    this.root.replaceChildren();

    const todayEvents = this.model
      .getEventsByDay(this.day)
      .sort((a, b) => a.start - b.start);

    todayEvents.forEach((event, index, arr) => {
      // Top padding before first event
      if (index === 0 && event.start > 0) {
        const topSeparator = document.createElement("div");
        topSeparator.className = "w-full bg-white shrink-0";
        topSeparator.style.height = `${24 * event.start}px`;
        this.root.appendChild(topSeparator);
      }

      // Render the event
      const eventLabel = new EventLabel(this.model, event);
      this.root.appendChild(eventLabel.root);

      // Padding between events
      const next = arr[index + 1];
      if (next) {
        const gap = next.start - event.end;
        if (gap > 0) {
          const separator = document.createElement("div");
          separator.className = "w-full bg-white shrink-0";
          separator.style.height = `${24 * gap}px`;
          this.root.appendChild(separator);
        }
      }
    });
  }
}
