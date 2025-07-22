import { Observer } from "../observer";
import { Model } from "../model";
import { Middle } from "./middle";
import { ModeSwitch } from "./modeSwitch";
import { Status } from "./status";
import { agendaView } from "./agenda/agendaview";

export class InnerView implements Observer {
  middle: Middle;
  modeSwitch: ModeSwitch;
  status: Status;
  agendaView: agendaView;

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");

    // Replaces .inner
    this.container.className = `
      flex flex-col gap-3 w-screen h-screen box-border p-2
    `.replace(/\s+/g, " ").trim();

    this.middle = new Middle(model);
    this.modeSwitch = new ModeSwitch(model);
    this.status = new Status(model);
    this.agendaView = new agendaView(model, 0);

    // Switch controller
    this.modeSwitch.agendaButton.addEventListener("click", () => {
      model.setMode("Agenda");
    });

    this.model.addObserver(this);
  }

  update() {
    this.root.replaceChildren();

    const mode = this.model.getMode();
    const main = mode === "Overview" ? this.middle.root : this.agendaView.root;

    // Ensure the middle section flexes
    main.classList.add("flex-1", "overflow-auto");
    this.modeSwitch.root.classList.add("flex-none");
    this.status.root.classList.add("flex-none");

    this.root.appendChild(this.modeSwitch.root);
    this.root.appendChild(main);
    this.root.appendChild(this.status.root);
  }
}
