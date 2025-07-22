import { Observer } from "../observer";
import { Model } from "../model";
import { InnerView } from "./innerView";
import { ModifyView } from "./modifyView";
import "./mainView.css"

export class MainView implements Observer {
  update() {
   this.root.replaceChildren();
    if (this.model.edit) {
      this.root.appendChild(new InnerView(this.model).root);
      this.root.appendChild(new ModifyView(this.model).root);
    }
    else {
      this.root.appendChild(new InnerView(this.model).root);
    }
  }

 private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  } 


  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.className = "main";



    // setup the view design
    // this.fillWidth = 1;
    // this.fillHeight = 1;

    this.root.appendChild(new InnerView(model).root);

    // controllers

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
