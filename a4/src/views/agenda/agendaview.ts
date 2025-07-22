import { Observer } from "../../observer";
import { Model } from "../../model";

export class agendaView implements Observer {
  prevButton = document.createElement("button");
  nextButton = document.createElement("button");

  buttonsContainer = document.createElement("div");
  filler = document.createElement("div");
  desc = document.createElement("div");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model, private day: number) {
    this.container = document.createElement("div");

    // Tailwind class replacements
    this.container.className =
      "flex flex-col w-full h-full box-border border border-black p-4";
    this.buttonsContainer.className =
      "flex items-center gap-2 mt-4";
    this.filler.className = "flex-1";
    this.desc.className =
      "flex-1 flex flex-col justify-center items-center gap-2 text-2xl font-sans";

    this.prevButton.innerText = "Previous";
    this.prevButton.className =
      "flex-none px-4 py-2 text-sm border border-gray-500 rounded bg-white justify-center cursor-pointer transition-colors duration-200 hover:bg-blue-200 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed";

    this.nextButton.innerText = "Next";
    this.nextButton.className =
      "flex-none px-4 py-2 text-sm border border-gray-500 rounded bg-white justify-center cursor-pointer transition-colors duration-200 hover:bg-blue-200 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed";

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

  update() {
    this.root.replaceChildren();
    this.desc.replaceChildren();

    const description = document.createElement("span");
    description.innerText = `${this.model.curEvent.description}`;
    description.className = "text-[20pt]";

    const daytime_label = document.createElement("span");
    daytime_label.innerText = `${this.model.day_of_week[this.model.curEvent.day]} ${this.model.curEvent.start}:00 - ${this.model.curEvent.end}:00`;

    this.desc.appendChild(description);
    this.desc.appendChild(daytime_label);

    this.prevButton.disabled = !(this.model.curEventIdx > 1);
    this.nextButton.disabled =
      this.model.curEventIdx >= this.model.numberSelectedEvents;

    this.root.appendChild(this.desc);
    this.root.appendChild(this.buttonsContainer);
  }
}
