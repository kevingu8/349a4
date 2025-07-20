import { Observer } from "../observer";
import { Model } from "../model";
import { Middle } from "./middle";
import { ModeSwitch } from "./modeSwitch";
import { Status } from "./status";
import { agendaView } from "./agenda/agendaview";
import "./innerView.css"

export class InnerView  implements Observer {
  update() {
    this.root.replaceChildren();
    if (this.model.getMode() === "Overview") {
      this.root.appendChild(this.modeSwitch.root);
      this.root.appendChild(this.middle.root);
      this.root.appendChild(this.status.root)
    }
    else {
      this.root.appendChild(this.modeSwitch.root);
      this.root.appendChild(this.agendaView.root);
      this.root.appendChild(this.status.root)
    }
    // remove all child observers from model to avoid memory leak
  }

  middle: Middle;
  modeSwitch: ModeSwitch;
  status: Status;
  agendaView: agendaView

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  } 

  constructor(private model: Model) {

    this.container = document.createElement("div");
    this.container.className = "inner";

    this.middle = new Middle(model);
    this.modeSwitch = new ModeSwitch(model);
    this.status = new Status(model);
    this.agendaView = new agendaView(model, 0);

    // // setup the view design
    // this.fillWidth = 1;
    // this.fillHeight = 1;

    

    // controllers
    this.modeSwitch.agendaButton.addEventListener("click", () => {
      model.setMode('Agenda');
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
