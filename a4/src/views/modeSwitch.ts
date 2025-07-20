import { Observer } from "../observer";
import { Model } from "../model";
import "./modeSwtich.css"

export class ModeSwitch implements Observer {

  // private agendaButton = new SKButton({
  //   text: "Agenda",
  //   width: 80,
  //   margin: 8,
  // });

  agendaButton = document.createElement("button");
  overviewButton = document.createElement("button");

  undoButton = document.createElement("button");
  redoButton = document.createElement("button");

  private filler = document.createElement("div");
  // private filler = new SKContainer({
  //   fillWidth: 1,
  // });

  // private overviewButton = new SKButton({
  //   text: "Overview",
  //   width: 80,
  //   margin: 8,
  // });

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
        return this.container;
  }

  constructor(private model: Model) {

    // controllers
    this.container = document.createElement("div");
    this.container.className = "mode-switch";

    this.agendaButton.innerText = "Agenda";
    this.overviewButton.innerText = "Overview";

    this.undoButton.innerText = "Undo";
    this.redoButton.innerText = "Redo";

    this.filler.className = "filler";

    this.agendaButton.addEventListener("click", () => {
      if (this.model.numberSelectedEvents > 0) {
        model.curEvent = this.model.selectedEvents[0];
        model.curEventIdx = 1;
        model.setMode('Agenda');
      }
    });

    this.overviewButton.addEventListener("click", () => {
      model.setMode('Overview');
    });

    this.undoButton.addEventListener("click", () => {
      model.undo();
    });

    this.redoButton.addEventListener("click", () => {
      model.redo();
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }

  update() {
    this.root.replaceChildren();
    this.agendaButton.disabled =  this.model.selectedEvents.length === 0;
    this.undoButton.disabled = !this.model.canUndo;
    this.redoButton.disabled = !this.model.canRedo;

    if (this.model.getMode() === "Overview") {
      this.root.appendChild(this.undoButton);
      this.root.appendChild(this.redoButton);
      this.root.appendChild(this.filler);
      this.root.appendChild(this.agendaButton);
      // this.fill = "lightgray"
    } else {
      // this.root.appendChild(this.filler)
      this.root.appendChild(this.overviewButton);
      // this.fill = "lightblue"
    }
  }
}
