import { useEffect, useRef } from "preact/hooks";
import { Model } from "../../model";
import { Observer } from "../../observer";

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
        description.className = "text-[20pt] font-sans";
        desc.appendChild(description);

        const daytime_label = document.createElement("span");
        daytime_label.innerText = `${model.day_of_week[model.curEvent.day]} ${model.curEvent.start}:00 - ${model.curEvent.end}:00`;
        daytime_label.className = "text-[20pt] font-sans";
        desc.appendChild(daytime_label);

        const prevButton = prevButtonRef.current!;
        const nextButton = nextButtonRef.current!;
        const filler1 = document.createElement("div");
        const filler2 = document.createElement("div");
        filler1.className = "flex-1";
        filler2.className = "flex-1";

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "flex items-center gap-2 mt-4";
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
    <div
      ref={containerRef}
      className="agenda-view flex flex-col w-full h-full box-border border border-black p-4"
    >
      <div
        ref={descRef}
        className="agenda-desc flex-1 flex flex-col justify-center items-center gap-2 text-[20pt] font-sans"
      />
      <button
        ref={prevButtonRef}
        className="flex-none px-4 py-2 text-[0.9rem] border border-gray-500 rounded bg-white cursor-pointer transition-colors hover:bg-blue-200 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => model.prevTask()}
      >
        Previous
      </button>
      <button
        ref={nextButtonRef}
        className="flex-none px-4 py-2 text-[0.9rem] border border-gray-500 rounded bg-white cursor-pointer transition-colors hover:bg-blue-200 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => model.nextTask()}
      >
        Next
      </button>
    </div>
  );
}
