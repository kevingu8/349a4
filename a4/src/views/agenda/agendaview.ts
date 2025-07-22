import { Observer } from "../../observer";
import { Model } from "../../model";
import "./agendaview.css";

export class agendaView implements Observer {
  // prevButton = new SKButton({
  //   text: "Previous",
  //   width: 80,
  // });

  // nextButton = new SKButton({
  //   text: "Next",
  //   width: 80,

  // });

  prevButton = document.createElement("button");
  nextButton = document.createElement("button");

  buttonsContainer = document.createElement("div");

  // buttonsContainer = new SKContainer({
  //   fillWidth: 1,
  //   layoutMethod: new Layout.FillRowLayout({ gap: 8 }),
  // });

  filler = document.createElement("div");

  // private filler = new SKContainer({
  //   fillWidth: 1,
  // });

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model, private day: number) {
    // super();
    // this.id = "middle";
    // this.fillWidth = 1;
    // this.fillHeight = 1;
    // this.height = 600;
    // this.margin = 8;
    // this.border = "1px solid black";

    this.container = document.createElement("div");

    this.container.className = "agenda-view";
    this.buttonsContainer.className = "buttons-container";
    this.filler.className = "filler";
    this.desc.className = "agenda-desc"; // note: rename your “desc” field to match the class name

    this.prevButton.innerText = "Previous";
    this.nextButton.innerText = "Next";

    this.model.addObserver(this);
    this.buttonsContainer.appendChild(this.filler);
    this.buttonsContainer.appendChild(this.prevButton);
    this.buttonsContainer.appendChild(this.nextButton);
    this.buttonsContainer.appendChild(this.filler);

    this.prevButton.addEventListener("click", () => {
      this.model.prevTask();
    });

    this.nextButton.addEventListener("click", () => {
      this.model.nextTask();
    });
  }

  desc = document.createElement("div");

  // private desc = new SKContainer({
  //   fillWidth: 1,
  //   layoutMethod: new StackColLayout(),
  //   margin: 230,
  // });

  update() {
    this.root.replaceChildren();
    this.desc.replaceChildren();
    const description = document.createElement("span");
    description.innerText = `${this.model.curEvent.description}`;
    description.className = "description";
    this.desc.appendChild(description);
    // this.desc.appendChild(new SKLabel({
    //   text: `${this.model.curEvent.description}`,
    //   fillWidth: 1,
    //   height: 50,
    //   fillHeight: 1,
    // }))

    const daytime_label = document.createElement("span");
    daytime_label.innerText = `${this.model.day_of_week[this.model.curEvent.day]} ${this.model.curEvent.start}:00 - ${this.model.curEvent.end}:00`;
    daytime_label.className = "daytime-label"
    this.desc.appendChild(daytime_label);
    // this.desc.appendChild(new SKLabel({
    //   text: `${this.model.day_of_week[this.model.curEvent.day]} ${this.model.curEvent.start}:00 - ${this.model.curEvent.end}:00`,
    //   height: 50,
    //   fillWidth: 1,
    //   fillHeight: 1,
    // }))
    this.prevButton.disabled = !(this.model.curEventIdx > 1);
    this.nextButton.disabled = this.model.curEventIdx >= this.model.numberSelectedEvents;
    this.root.appendChild(this.desc);
    this.root.appendChild(this.buttonsContainer);
  }
}
