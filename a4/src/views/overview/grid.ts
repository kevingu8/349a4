import { Observer } from "../../observer";
import { Model } from "../../model";
import { DayBody } from "./dayBody";

export class Grid implements Observer {
  dayLabels = document.createElement("div");
  dayBodies = document.createElement("div");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className = "flex flex-col h-full w-full";

    // 7 equal columns for labels
    this.dayLabels.className =
      "grid grid-cols-7 text-xs text-center border border-gray-300 bg-white";
    
    // 7 equal columns for day columns with hour lines
    this.dayBodies.className =
      "grid grid-cols-7 border-x border-b border-gray-300 rounded-b bg-white h-[576px]";

    this.root.appendChild(this.dayLabels);
    this.root.appendChild(this.dayBodies);
    this.model.addObserver(this);
  }

  update() {
    this.dayLabels.replaceChildren();
    this.dayBodies.replaceChildren();

    this.model.day_of_week.forEach((day, index) => {
      const dayLabel = document.createElement("div");
      dayLabel.innerText = day;
      dayLabel.className = "py-2 border-r last:border-r-0";
      
      const number_day = index;
      const dayBody = new DayBody(this.model, number_day);

      this.dayLabels.appendChild(dayLabel);
      this.dayBodies.appendChild(dayBody.root);
    });
  }
}
