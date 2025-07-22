
import { Observer } from "../observer";
import { Model } from "../model";
import { QuantityWidget } from "../widgets/quantity";
import "./modifyView.css"

export class ModifyView implements Observer {
  // ─── New fields ───────────────────────────────────────────────────────────────
  private descriptionField = document.createElement("input");
  private dayOfWeekSelect = document.createElement("select");
  private startTimeInput   = document.createElement("input");
  private endTimeInput     = document.createElement("input");

  private saveButton   = document.createElement("button");
  private cancelButton = document.createElement("button");
  private filler       = document.createElement("div");

  private container = document.createElement("div");
  get root() { return this.container }

  constructor(private model: Model) {
    // ─── Configure the new controls ─────────────────────────────────────────────
    // Description
    this.descriptionField.type     = "text";
    this.descriptionField.id       = "description-field";
    this.descriptionField.required = true;
    this.descriptionField.value = this.model.editingEvent.description;

    // Day-of-Week dropdown
    this.dayOfWeekSelect.id       = "day-of-week-select";
    this.dayOfWeekSelect.required = true;
    this.model.day_of_week.forEach((dayName, idx) => {
      const opt = document.createElement("option");
      opt.value    = idx.toString();
      opt.text     = dayName;
      if (idx === this.model.editingEvent.day) opt.selected = true;
      this.dayOfWeekSelect.appendChild(opt);
    });

    // Start Time (hour 0–23)
    this.startTimeInput.type     = "number";
    this.startTimeInput.id       = "start-time-input";
    this.startTimeInput.min      = "0";
    this.startTimeInput.max      = "23";
    this.startTimeInput.value    = String(this.model.editingEvent.start);
    this.startTimeInput.required = true;

    // End Time (hour 0–23)
    this.endTimeInput.type     = "number";
    this.endTimeInput.id       = "end-time-input";
    this.endTimeInput.min      = "0";
    this.endTimeInput.max      = "23";
    this.endTimeInput.value    = String(this.model.editingEvent.end);
    this.endTimeInput.required = true;

    // Buttons
    this.saveButton.innerText   = "Save";
    this.saveButton.type        = "submit";
    this.cancelButton.innerText = "Cancel";
    this.cancelButton.type      = "button";

    // Hook them up
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
    // clear & re-build
    this.container.replaceChildren();
    this.container.className = "modify-view";

    // DESCRIPTION ROW
    const descRow = document.createElement("div");
    descRow.className = "modify-row";
    const descLabel = document.createElement("label");
    descLabel.htmlFor = this.descriptionField.id;
    descLabel.innerText = "Description:";
    descRow.append(descLabel, this.descriptionField);
    this.container.appendChild(descRow);

    // DAY-OF-WEEK ROW
    const dowRow = document.createElement("div");
    dowRow.className = "modify-row";
    const dowLabel = document.createElement("label");
    dowLabel.htmlFor = this.dayOfWeekSelect.id;
    dowLabel.innerText = "Day of Week:";
    dowRow.append(dowLabel, this.dayOfWeekSelect);
    this.container.appendChild(dowRow);

    // START TIME ROW
    const startRow = document.createElement("div");
    startRow.className = "modify-row";
    const startLabel = document.createElement("label");
    startLabel.htmlFor = this.startTimeInput.id;
    startLabel.innerText = "Start Time:";
    startRow.append(startLabel, this.startTimeInput);
    this.container.appendChild(startRow);

    // END TIME ROW
    const endRow = document.createElement("div");
    endRow.className = "modify-row";
    const endLabel = document.createElement("label");
    endLabel.htmlFor = this.endTimeInput.id;
    endLabel.innerText = "End Time:";
    endRow.append(endLabel, this.endTimeInput);
    this.container.appendChild(endRow);

    // BUTTONS ROW
    const btnRow = document.createElement("div");
    btnRow.className = "modify-row modify-buttons";
    btnRow.append(this.saveButton, this.cancelButton);
    this.container.appendChild(btnRow);
  }

  /** quick form-level validation */
  private validate(): boolean {
    // let the browser show its validation UI
    return (this.descriptionField.checkValidity() &&
            this.dayOfWeekSelect.checkValidity() &&
            this.startTimeInput.checkValidity() &&
            this.endTimeInput.checkValidity() &&
            +this.endTimeInput.value > +this.startTimeInput.value);
  }
}
