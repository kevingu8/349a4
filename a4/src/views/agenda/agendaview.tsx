/** AgendaView.tsx */
import { useEffect, useRef } from "preact/hooks";
import { Model } from "../../model";
import { Observer } from "../../observer";
import "./agendaview.css";

interface AgendaViewProps {
  model: Model;
  day: number;
}

export function AgendaView({ model }: AgendaViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer: Observer = {
      update: () => {
        const container = containerRef.current;
        const desc = descRef.current;
        if (!container || !desc) return;

        // Clear old content
        container.replaceChildren();
        desc.replaceChildren();

        // Create new content
        const description = document.createElement("span");
        description.innerText = `${model.curEvent.description}`;
        description.className = "description";
        desc.appendChild(description);

        const daytime_label = document.createElement("span");
        daytime_label.innerText = `${model.day_of_week[model.curEvent.day]} ${model.curEvent.start}:00 - ${model.curEvent.end}:00`;
        daytime_label.className = "daytime-label";
        desc.appendChild(daytime_label);

        const prevButton = prevButtonRef.current!;
        const nextButton = nextButtonRef.current!;
        const filler1 = document.createElement("div");
        const filler2 = document.createElement("div");
        filler1.className = "filler";
        filler2.className = "filler";

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";
        buttonsContainer.append(filler1, prevButton, nextButton, filler2);

        prevButton.disabled = !(model.curEventIdx > 1);
        nextButton.disabled = model.curEventIdx >= model.numberSelectedEvents;

        container.appendChild(desc);
        container.appendChild(buttonsContainer);
      },
    };

    model.addObserver(observer);
    observer.update();

    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div ref={containerRef} className="agenda-view">
      <div ref={descRef} className="agenda-desc" />
      <button ref={prevButtonRef} onClick={() => model.prevTask()}>
        Previous
      </button>
      <button ref={nextButtonRef} onClick={() => model.nextTask()}>
        Next
      </button>
    </div>
  );
}
