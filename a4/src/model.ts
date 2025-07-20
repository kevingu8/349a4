import { Subject } from "./observer";
import { UndoManager } from "./undo";

export type Event = {
  description: string;
  selected: boolean;
  day: number;
  start: number;
  end: number;
};

export class Model extends Subject {
  private events: Event[] = [];
  private undoMgr: UndoManager = new UndoManager();
  private all_events: Event[] = eventBank;
  curEvent: Event = eventBank[0];
  curEventIdx = 1;
  editingEvent: Event = eventBank[0];

  private mode: "Overview" | "Agenda";
  edit: boolean = false;

  day_of_week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  day_of_week_sim = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  constructor() {
    super();
    this.mode = "Overview";

    this.initEvents();
    this.curEvent = this.events[0];
    this.curEventIdx = 1;
    this.notifyObservers();
  }

  prevTask() {
    if (this.curEventIdx > 1) {
      this.curEventIdx -= 1;
      this.curEvent = this.selectedEvents[this.curEventIdx - 1];
    }
    this.notifyObservers();
  }

  nextTask() {
    if (this.curEventIdx < this.selectedEvents.length) {
      this.curEventIdx += 1;
      this.curEvent = this.selectedEvents[this.curEventIdx - 1];
    }
    this.notifyObservers();
  }

  initEvents() {
    while (this.events.length < 4) {
      const randomIndex = Math.floor(Math.random() * this.all_events.length);
      const event = this.all_events[randomIndex];
      if (!this.events.some((e) => this.isEquivalentEvent(e, event))) {
        this.events.push({ ...event, selected: false });
      }
    }
    this.events.sort((a, b) => a.day - b.day || a.start - b.start);
  }

  editEvent(event: Event) {
    this.edit = true;
    this.editingEvent = { ...event };
    this.notifyObservers();
  }

  get numberEvents(): number {
    return this.events.length;
  }

  get numberSelectedEvents(): number {
    return this.events.filter((event) => event.selected).length;
  }

  get selectedEvents(): Event[] {
    return this.events.filter((event) => event.selected);
  }

  isEquivalentEvent(event1: Event, event2: Event): boolean {
    return (
      event1.description === event2.description &&
      event1.day === event2.day &&
      event1.start === event2.start &&
      event1.end === event2.end
    );
  }

  getEventsByDay(day: number): Event[] {
    return this.events.filter((event) => event.day === day);
  }

  getMode(): "Overview" | "Agenda" {
    return this.mode;
  }

  setMode(mode: "Overview" | "Agenda") {
    this.mode = mode;
    this.notifyObservers();
  }

  getEvents(): Event[] {
    return this.events;
  }

  selectAllEvents() {
    this.events.forEach((event) => {
      event.selected = true;
    });
    this.notifyObservers();
  }

  deselectAllEvents() {
    this.events.forEach((event) => {
      event.selected = false;
    });
    this.notifyObservers();
  }

  selectEvent(event: Event) {
    this.undoMgr.execute({
      do: () => {
        this.events.forEach((e) => {
          if (this.isEquivalentEvent(e, event)) {
            e.selected = !e.selected;
          }
        });
      },

      undo: () => {
        this.events.forEach((e) => {
          if (this.isEquivalentEvent(e, event)) {
            e.selected = !e.selected;
          }
        });
      },
    });
    this.events.forEach((e) => {
      if (this.isEquivalentEvent(e, event)) {
        e.selected = !e.selected;
      }
    });
    this.notifyObservers();
  }

  modifyEvent(
    event: Event,
    newDescription: string,
    newDay: number,
    newStart: number,
    newEnd: number
  ) {
    const index = this.events.findIndex((e) =>
      this.isEquivalentEvent(e, event)
    );

    if (index === -1) {
      return;
    }
    const oldEvent = this.events[index];
    const newEvent = {
      ...this.events[index],
      description: newDescription,
      day: newDay,
      start: newStart,
      end: newEnd,
    };
    this.undoMgr.execute({
      do: () => {
        this.events[index] = newEvent;
      },

      undo: () => {
        const idx = this.events.findIndex((e) =>
          this.isEquivalentEvent(e, newEvent)
        );
        if (idx !== -1) {
          this.events[idx] = oldEvent;
        }
      },
    });
    this.events[index] = newEvent;
    this.edit = false;
    this.notifyObservers();
  }

  cancelModifyEvent() {
    this.edit = false;
    this.notifyObservers();
  }

  get canUndo() {
    return this.undoMgr.canUndo;
  }

  get canRedo() {
    return this.undoMgr.canRedo;
  }

  undo() {
    this.undoMgr.undo();
    this.notifyObservers();
  }

  redo() {
    this.undoMgr.redo();
    this.notifyObservers();
  }

  removeSelectedEvent() {
    const selectedEvents = this.events.filter((event) => event.selected);

    this.undoMgr.execute({
      do: () => {
        selectedEvents.forEach((selectedEvent) => {
          this.events = this.events.filter(
            (e) => !this.isEquivalentEvent(e, selectedEvent)
          );
        });

        selectedEvents.forEach((selectedEvent) => {
          if (
            !this.all_events.some((e) =>
              this.isEquivalentEvent(e, selectedEvent)
            )
          ) {
            this.all_events.push(selectedEvent);
          }
        });
      },

      undo: () => {
        selectedEvents.forEach((selectedEvent) => {
          this.events = [...this.events, selectedEvent];
        });

        selectedEvents.forEach((selectedEvent) => {
          if (
            !this.all_events.some((e) =>
              this.isEquivalentEvent(e, selectedEvent)
            )
          ) {
            const idx = this.all_events.findIndex((e) =>
              this.isEquivalentEvent(e, selectedEvent)
            );
            if (idx !== -1) {
              this.all_events.splice(idx, 1);
            }
          }
        });
      },
    });

    selectedEvents.forEach((selectedEvent) => {
      this.events = this.events.filter(
        (e) => !this.isEquivalentEvent(e, selectedEvent)
      );
    });

    selectedEvents.forEach((selectedEvent) => {
      if (
        !this.all_events.some((e) => this.isEquivalentEvent(e, selectedEvent))
      ) {
        this.all_events.push(selectedEvent);
      }
    });

    this.notifyObservers();
  }

  addEvent() {
    let success = false;
    let eventToAdd = this.all_events[0];
    if (this.events.length < 10) {
      while (!success) {
        const randomIndex = Math.floor(Math.random() * this.all_events.length);
        const newEvent = { ...this.all_events[randomIndex], selected: false };

        if (!this.events.some((e) => this.isEquivalentEvent(e, newEvent))) {
          success = true;
          eventToAdd = newEvent;
        }
      }
    }

    this.undoMgr.execute({
      do: () => {
        this.events.push(eventToAdd);
        this.events.sort((a, b) => a.day - b.day || a.start - b.start);
      },
      undo: () => {
        const idx = this.events.findIndex((e) =>
          this.isEquivalentEvent(e, eventToAdd)
        );
        if (idx !== -1) {
          this.events.splice(idx, 1);
        }
        this.events.sort((a, b) => a.day - b.day || a.start - b.start);
      },
    });

    this.events.push(eventToAdd);
    this.events.sort((a, b) => a.day - b.day || a.start - b.start);
    this.notifyObservers();
  }

  clearEvents() {
    this.events = [];
    this.notifyObservers();
  }
}

const eventBank = [
  {
    description: "laundry",
    selected: false,
    day: 0,
    start: 15,
    end: 16,
  },
  {
    description: "gym",
    selected: false,
    day: 6,
    start: 8,
    end: 11,
  },
  {
    description: "dentist appointment",
    selected: false,
    day: 2,
    start: 11,
    end: 12,
  },
  {
    description: "get groceries",
    selected: false,
    day: 0,
    start: 13,
    end: 15,
  },
  {
    description: "meal prep",
    selected: false,
    day: 0,
    start: 19,
    end: 22,
  },
  {
    description: "walk the dog",
    selected: false,
    day: 1,
    start: 7,
    end: 8,
  },
  {
    description: "visit post office",
    selected: false,
    day: 4,
    start: 9,
    end: 10,
  },
  {
    description: "clean the kitchen",
    selected: false,
    day: 6,
    start: 14,
    end: 15,
  },
  {
    description: "cs349 lecture 1",
    selected: false,
    day: 1,
    start: 13,
    end: 15,
  },
  {
    description: "cs349 lecture 2",
    selected: false,
    day: 3,
    start: 13,
    end: 15,
  },
  {
    description: "project meeting",
    selected: false,
    day: 5,
    start: 12,
    end: 15,
  },
  {
    description: "yoga class",
    selected: false,
    day: 4,
    start: 19,
    end: 22,
  },
  {
    description: "brunch",
    selected: false,
    day: 0,
    start: 10,
    end: 14,
  },
  {
    description: "breakfast",
    selected: false,
    day: 1,
    start: 6,
    end: 7,
  },
  {
    description: "breakfast",
    selected: false,
    day: 2,
    start: 6,
    end: 7,
  },
  {
    description: "breakfast",
    selected: false,
    day: 3,
    start: 6,
    end: 7,
  },
  {
    description: "breakfast",
    selected: false,
    day: 4,
    start: 6,
    end: 7,
  },
  {
    description: "breakfast",
    selected: false,
    day: 5,
    start: 6,
    end: 7,
  },
  {
    description: "studying",
    selected: false,
    day: 1,
    start: 9,
    end: 12,
  },
  {
    description: "studying",
    selected: false,
    day: 2,
    start: 9,
    end: 12,
  },
  {
    description: "studying",
    selected: false,
    day: 3,
    start: 9,
    end: 12,
  },
  {
    description: "studying",
    selected: false,
    day: 4,
    start: 9,
    end: 12,
  },
  {
    description: "studying",
    selected: false,
    day: 5,
    start: 9,
    end: 12,
  },
  {
    description: "breakfast",
    selected: false,
    day: 5,
    start: 6,
    end: 7,
  },
  {
    description: "voluntering",
    selected: false,
    day: 2,
    start: 17,
    end: 21,
  },
  {
    description: "voluntering",
    selected: false,
    day: 4,
    start: 17,
    end: 21,
  },
  {
    description: "golf",
    selected: true,
    day: 5,
    start: 16,
    end: 20,
  },
  {
    description: "dinner with friends",
    selected: true,
    day: 3,
    start: 18,
    end: 21,
  },
];
