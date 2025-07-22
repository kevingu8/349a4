import { Observer } from "../../observer";
import { Model } from "../../model";
import { DayBody } from "./dayBody";
import "./grid.css"

export class Grid  implements Observer {

  // dayLabels = new SKContainer(
  //   {
  //     id: "day-labels",
  //     fillWidth: 1,
  //     fillHeight: 1,
  //     layoutMethod: new Layout.FillRowLayout({ gap: 4 }),
  //     border: "1px solid black",
  //   }
  // );

  dayLabels = document.createElement("div");
  
  dayBodies = document.createElement("div");

  // dayBodies = new SKContainer({
  //   id: "day-bodies",
  //   fillWidth: 1,
  //   fillHeight: 1,
  //   layoutMethod: new Layout.FillRowLayout({ gap: 4 }),
  //   margin: 4,
  // });

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {


    this.container = document.createElement("div");
    this.container.className = "grid";
    // this.container.style.height = `${24 * 24}px`;

    this.dayLabels.className = "day-labels";
    this.dayBodies.className = "day-bodies";

    // this.fillWidth = 1;
    // this.fillHeight = 1;
    // this.border = "1px solid black";


    this.root.appendChild(this.dayLabels);
    this.root.appendChild(this.dayBodies);
    this.model.addObserver(this);
  }

  update() {
    this.dayLabels.replaceChildren();
    this.dayBodies.replaceChildren();

    this.model.day_of_week.forEach((day, index) => {
      const dayLabel = document.createElement("span");
      dayLabel.innerText = day;
      
      // new SKLabel({
      //   text: day,
      //   fillWidth: 1,
      // });

      // dayLabel.font = "12pt sans-serif";
      
    
      const number_day = index
      const dayBody = new DayBody(this.model, number_day);

      this.dayLabels.appendChild(dayLabel);
      this.dayBodies.appendChild(dayBody.root);
    });
  }
}
