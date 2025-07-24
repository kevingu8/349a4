import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Model } from "../model";
import "./modifyView.css";

type ModifyViewProps = {
  model: Model;
};

export function ModifyView({ model }: ModifyViewProps) {
  const [description, setDescription] = useState(model.editingEvent.description);
  const [day, setDay] = useState(model.editingEvent.day);
  const [start, setStart] = useState(model.editingEvent.start);
  const [end, setEnd] = useState(model.editingEvent.end);

  const handleSave = () => {
    if (
      description.trim() &&
      start >= 0 && start <= 23 &&
      end >= 0 && end <= 23 &&
      end > start
    ) {
      model.modifyEvent(model.editingEvent, description, day, start, end);
    }
  };

  const handleCancel = () => {
    model.cancelModifyEvent();
  };

  useEffect(() => {
    const observer = {
      update: () => {
        const evt = model.editingEvent;
        setDescription(evt.description);
        setDay(evt.day);
        setStart(evt.start);
        setEnd(evt.end);
      }
    };
    model.addObserver(observer);
    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div className="modify-view">
      {/* DESCRIPTION */}
      <div className="modify-row">
        <label htmlFor="description-field">Description:</label>
        <input
          id="description-field"
          type="text"
          required
          value={description}
          onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* DAY OF WEEK */}
      <div className="modify-row">
        <label htmlFor="day-of-week-select">Day of Week:</label>
        <select
          id="day-of-week-select"
          required
          value={day}
          onChange={(e) => setDay(+((e.target as HTMLSelectElement).value))}
        >
          {model.day_of_week.map((dayName, idx) => (
            <option value={idx} key={idx}>
              {dayName}
            </option>
          ))}
        </select>
      </div>

      {/* START TIME */}
      <div className="modify-row">
        <label htmlFor="start-time-input">Start Time:</label>
        <input
          id="start-time-input"
          type="number"
          min="0"
          max="23"
          required
          value={start}
          onInput={(e) => setStart(+((e.target as HTMLInputElement).value))}
        />
      </div>

      {/* END TIME */}
      <div className="modify-row">
        <label htmlFor="end-time-input">End Time:</label>
        <input
          id="end-time-input"
          type="number"
          min="0"
          max="23"
          required
          value={end}
          onInput={(e) => setEnd(+((e.target as HTMLInputElement).value))}
        />
      </div>

      {/* BUTTONS */}
      <div className="modify-row modify-buttons">
        <button type="submit" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
