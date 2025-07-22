import { Observer } from "../observer";
import { Model } from "../model";

export class ModeSwitch implements Observer {
  agendaButton = document.createElement("button");
  overviewButton = document.createElement("button");
  undoButton = document.createElement("button");
  redoButton = document.createElement("button");
  private filler = document.createElement("div");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className =
      "flex justify-end items-center w-full bg-gray-200 px-2 py-2";

    this.agendaButton.innerText = "Agenda";
    this.overviewButton.innerText = "Overview";
    this.undoButton.innerText = "Undo";
    this.redoButton.innerText = "Redo";

    this.filler.className = "flex-grow";

    this.agendaButton.className = this.buttonBaseClasses();
    this.overviewButton.className = this.buttonBaseClasses();
    this.undoButton.className = this.buttonBaseClasses();
    this.redoButton.className = this.buttonBaseClasses();

    this.agendaButton.addEventListener("click", () => {
      if (this.model.numberSelectedEvents > 0) {
        this.model.curEvent = this.model.selectedEvents[0];
        this.model.curEventIdx = 1;
        this.model.setMode("Agenda");
      }
    });

    this.overviewButton.addEventListener("click", () => {
      this.model.setMode("Overview");
    });

    this.undoButton.addEventListener("click", () => {
      this.model.undo();
    });

    this.redoButton.addEventListener("click", () => {
      this.model.redo();
    });

    this.model.addObserver(this);
  }

  update() {
  this.root.replaceChildren();

  this.agendaButton.disabled = this.model.selectedEvents.length === 0;
  this.undoButton.disabled = !this.model.canUndo;
  this.redoButton.disabled = !this.model.canRedo;

  this.setDisabledStyles(this.agendaButton);
  this.setDisabledStyles(this.undoButton);
  this.setDisabledStyles(this.redoButton);

  if (this.model.getMode() === "Overview") {
    const actionContainer = document.createElement("div");
    actionContainer.className = "flex items-center gap-2 bg-gray-200 p-2 rounded";

    actionContainer.appendChild(this.undoButton);
    actionContainer.appendChild(this.redoButton);

    this.root.appendChild(actionContainer);
    this.root.appendChild(this.filler);
    this.root.appendChild(this.agendaButton);
  } else {
    this.root.appendChild(this.overviewButton);
  }

  this.toggleActiveState(this.agendaButton, this.model.getMode() === "Agenda");
  this.toggleActiveState(this.overviewButton, this.model.getMode() === "Overview");
}


  private buttonBaseClasses(): string {
    return "px-4 py-1 mx-1 text-sm border border-gray-500 rounded bg-white hover:bg-gray-200 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed";
  }

  private setDisabledStyles(button: HTMLButtonElement) {
    if (button.disabled) {
      button.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      button.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  private toggleActiveState(button: HTMLButtonElement, isActive: boolean) {
    if (isActive) {
      button.classList.add("bg-blue-600", "text-white", "border-blue-700");
    } else {
      button.classList.remove("bg-blue-600", "text-white", "border-blue-700");
    }
  }
}
