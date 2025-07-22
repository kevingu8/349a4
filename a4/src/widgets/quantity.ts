type SKQuantityWidgetProps = {
  counter?: number;
  min_value?: number;
  max_value?: number;
  default_count?: number;
  default_text?: string;
  mapping?: (value: number) => string;
  addEffect?: (value: number) => boolean;
  minusEffect?: (value: number) => boolean;
};

export class QuantityWidget {
  counter = 1;
  default_count = 1;
  default_text = "0";
  mapping: (value: number) => string = (value: number) => value.toString();
  addEffect: (value: number) => boolean = () => true;
  minusEffect: (value: number) => boolean = () => true;

  incrementButton = document.createElement("button");
  resetButton = document.createElement("button");
  decrementButton = document.createElement("button");
  buttons = document.createElement("div");

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor({
    counter = 1,
    min_value = 1,
    max_value = 99,
    default_count = 0,
    default_text = "0",
    mapping = (value: number) => value.toString(),
    addEffect = () => true,
    minusEffect = () => true,
  }: SKQuantityWidgetProps = {}) {
    this.counter = counter;
    this.default_count = default_count;
    this.default_text = default_text;
    this.mapping = mapping;
    this.addEffect = addEffect;
    this.minusEffect = minusEffect;

    this.container = document.createElement("div");
    this.container.className = "p-1 flex flex-row items-center bg-white text-xs";

    const label = document.createElement("span");
    label.className = "w-4 text-left";
    label.innerText = "";

    this.incrementButton.innerText = "+";
    this.resetButton.innerText = default_text !== "0" ? default_text : this.mapping(this.counter);
    this.decrementButton.innerText = "-";

    this.incrementButton.className =
      "text-[8px] w-[30px] border-0 rounded-none";
    this.resetButton.className =
      "text-[8px] w-[30px] border-0 rounded-none";
    this.decrementButton.className =
      "text-[8px] w-[30px] border-0 rounded-none";

    this.buttons.className = "flex flex-col gap-[1px] opacity-0 hover:opacity-100 transition-opacity";

    this.buttons.appendChild(this.incrementButton);
    this.buttons.appendChild(this.resetButton);
    this.buttons.appendChild(this.decrementButton);

    this.container.appendChild(label);
    this.container.appendChild(this.buttons);

    // controller
    this.incrementButton.addEventListener("click", () => {
      if (this.counter < max_value && this.addEffect(this.counter)) {
        this.counter++;
        this.resetButton.innerText = this.mapping(this.counter);
      }
    });

    this.decrementButton.addEventListener("click", () => {
      if (this.counter > min_value && this.minusEffect(this.counter)) {
        this.counter--;
        this.resetButton.innerText = this.mapping(this.counter);
      }
    });

    this.resetButton.addEventListener("click", () => {
      this.counter = this.default_count;
      this.resetButton.innerText = this.mapping(this.counter);
      this.addEffect(this.counter);
    });
  }
}
