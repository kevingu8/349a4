import "./quantity.css"
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
  addEffect: (value: number) => boolean = () => { return true; };
  minusEffect: (value: number) => boolean = () => { return true; };

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
    addEffect = () => { return true; }, 
    minusEffect = () => { return true; }
  }: SKQuantityWidgetProps = {}) {
    this.counter = counter;
    this.default_count = default_count;
    this.mapping = mapping;
    this.addEffect = addEffect;
    this.minusEffect = minusEffect;
    
    this.container = document.createElement("div");
    this.container.className = "quantity_widget";
    this.incrementButton.innerText = "+";
    this.resetButton.innerText = default_text !== "0" ? default_text : this.mapping(this.counter);
    this.decrementButton.innerText = "-";

    this.buttons.appendChild(this.incrementButton);
    this.buttons.appendChild(this.resetButton);
    this.buttons.appendChild(this.decrementButton);

    // controller
    this.incrementButton.addEventListener("action", () => {
      if (this.counter < max_value) {
        if (this.addEffect(this.counter)) {
          this.counter++;
          this.resetButton.innerText = this.mapping(this.counter);
        }
      }
    });

    this.decrementButton.addEventListener("action", () => {
      if (this.counter > min_value) {
        if (this.minusEffect(this.counter)) {
          this.counter--;
          this.resetButton.innerText = this.mapping(this.counter);
        }
      }
    });

    this.resetButton.addEventListener("action", () => {
      this.counter = this.default_count;
      this.resetButton.innerText = this.mapping(this.counter);
      this.addEffect(this.counter);
    });
  }
}
