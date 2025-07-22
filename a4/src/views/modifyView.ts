import { Observer } from "../observer";
import { Model } from "../model";

export class ModifyView implements Observer {
  private descriptionField = document.createElement("input");
  private dayOfWeekSelect = document.createElement("select");
  private startTimeInput = document.createElement("input");
  private endTimeInput = document.createElement("input");

  private saveButton = document.createElement("button");
  private cancelButton = document.createElement("button");
  private filler = document.createElement("div");

  private container = document.createElement("div");
  get root() {
    return this.container;
  }

  constructor(private model: Model) {
    this.descriptionField.type = "text";
    this.descriptionField.required = true;
    this.descriptionField.value = this.model.editingEvent.description;
    this.descriptionField.className =
      "w-full px-2 py-1 text-sm border border-gray-300 rounded";

    this.dayOfWeekSelect.required = true;
    this.dayOfWeekSelect.className =
      "w-full px-2 py-1 text-sm border border-gray-300 rounded";
    this.model.day_of_week.forEach((dayName, idx) => {
      const opt = document.createElement("option");
      opt.value = idx.toString();
      opt.text = dayName;
      if (idx === this.model.editingEvent.day) opt.selected = true;
      this.dayOfWeekSelect.appendChild(opt);
    });

    this.startTimeInput.type = "number";
    this.startTimeInput.min = "0";
    this.startTimeInput.max = "23";
    this.startTimeInput.value = String(this.model.editingEvent.start);
    this.startTimeInput.required = true;
    this.startTimeInput.className =
      "w-full px-2 py-1 text-sm border border-gray-300 rounded";

    this.endTimeInput.type = "number";
    this.endTimeInput.min = "0";
    this.endTimeInput.max = "23";
    this.endTimeInput.value = String(this.model.editingEvent.end);
    this.endTimeInput.required = true;
    this.endTimeInput.className =
      "w-full px-2 py-1 text-sm border border-gray-300 rounded";

    this.saveButton.innerText = "Save";
    this.saveButton.type = "submit";
    this.saveButton.className =
      "min-w-[80px] px-4 py-1 text-sm rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-400";

    this.cancelButton.innerText = "Cancel";
    this.cancelButton.type = "button";
    this.cancelButton.className =
      "min-w-[80px] px-4 py-1 text-sm rounded border border-gray-300";

    this.saveButton.addEventListener("click", () => {
      if (!this.validate()) return;
      this.model.modifyEvent(
        this.model.editingEvent,
        this.descriptionField.value,
        +this.dayOfWeekSelect.value,
        +this.startTimeInput.value,
        +this.endTimeInput.value
      );
    });

    this.cancelButton.addEventListener("click", () => {
      this.model.cancelModifyEvent();
    });

    model.addObserver(this);
  }

  update() {
    this.container.replaceChildren();
    this.container.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] flex flex-col gap-4 p-6 w-[80vw] h-[80vh] max-w-[900px] bg-white rounded-lg shadow-lg overflow-y-auto font-sans";

    this.container.appendChild(this.makeRow("Description:", this.descriptionField));
    this.container.appendChild(this.makeRow("Day of Week:", this.dayOfWeekSelect));
    this.container.appendChild(this.makeRow("Start Time:", this.startTimeInput));
    this.container.appendChild(this.makeRow("End Time:", this.endTimeInput));

    const btnRow = document.createElement("div");
    btnRow.className = "flex justify-end gap-3 mt-auto pt-4";
    btnRow.append(this.saveButton, this.cancelButton);
    this.container.appendChild(btnRow);
  }

  private makeRow(labelText: string, control: HTMLElement): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "flex items-center gap-3 py-1";
    const label = document.createElement("label");
    label.innerText = labelText;
    label.className = "w-[140px] text-right text-sm font-medium text-gray-700";
    row.append(label, control);
    return row;
  }

  private validate(): boolean {
    return (
      this.descriptionField.checkValidity() &&
      this.dayOfWeekSelect.checkValidity() &&
      this.startTimeInput.checkValidity() &&
      this.endTimeInput.checkValidity() &&
      +this.endTimeInput.value > +this.startTimeInput.value
    );
  }
}
