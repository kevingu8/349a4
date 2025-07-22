import { Observer } from "../../observer";
import { Model } from "../../model";
import "./toolBar.css"

export class ToolBar  implements Observer {

  // allButton = new SKButton({
  //     text: "All",
  //     width: 80,
  //   });

  allButton = document.createElement("button")
  noneButton = document.createElement("button")
  deleteButton = document.createElement("button")
  addButton = document.createElement("button")
    
  // noneButton = new SKButton({
  //     text: "None",
  //     width: 80,
  //   });

  // deleteButton = new SKButton({
  //     text: "Delete",
  //     width: 80,
  //   });

  // addButton = new SKButton({
  //     text: "Add",
  //     width: 80,
  //   });

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // super();
    // this.id = "middle";
    // this.fillWidth = 1;
    // this.fillHeight = 1;
    // this.margin = 8;

    this.container = document.createElement("div");
    this.root.className = "toolbar";

    this.allButton.innerText = "All";
    this.noneButton.innerText = "None";
    this.deleteButton.innerText = "Delete";
    this.addButton.innerText = "Add";

    this.root.appendChild(this.allButton);
    this.root.appendChild(this.noneButton);
    this.root.appendChild(this.deleteButton);
    this.root.appendChild(this.addButton);

    
    // Controllers
    this.allButton.addEventListener("click", () => {
      this.model.selectAllEvents();
    });

    this.noneButton.addEventListener("click", () => {
      this.model.deselectAllEvents();
    });

    this.deleteButton.addEventListener("click", () => {
      this.model.removeSelectedEvent();
    });

    this.addButton.addEventListener("click", () => {
      this.model.addEvent();
    });

    this.model.addObserver(this);
  }

  update() {
    this.deleteButton.disabled = !(this.model.numberSelectedEvents > 0);
    this.allButton.disabled = this.model.numberSelectedEvents === this.model.numberEvents;
    this.noneButton.disabled = this.model.numberSelectedEvents === 0;
    this.addButton.disabled = this.model.numberEvents === 10;
  }
}