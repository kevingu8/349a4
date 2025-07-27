import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { Model } from "../../model";
import { Observer } from "../../observer";

interface AgendaViewProps {
  model: Model;
  day: number;
}

export function AgendaView({ model }: AgendaViewProps) {
  const description = signal("");
  const timeLabel = signal("");
  const canGoPrev = signal(false);
  const canGoNext = signal(false);

  useEffect(() => {
    const observer: Observer = {
      update: () => {
        const cur = model.curEvent;
        description.value = cur.description;
        timeLabel.value = `${model.day_of_week[cur.day]} ${cur.start}:00 - ${cur.end}:00`;
        canGoPrev.value = model.curEventIdx > 1;
        canGoNext.value = model.curEventIdx < model.numberSelectedEvents;
      },
    };

    model.addObserver(observer);
    observer.update();

    return () => model.removeObserver(observer);
  }, [model]);

  return (
    <div className="flex flex-col w-full h-full box-border border border-black p-4">
      <div className="flex flex-col justify-center items-center gap-2 text-[20pt] font-sans flex-1">
        <span>{description.value}</span>
        <span>{timeLabel.value}</span>
      </div>

      <div className="flex items-center gap-2 mt-4 w-full">
        <div className="flex-1" />
        <button
          disabled={!canGoPrev.value}
          onClick={() => model.prevTask()}
          className="flex-none px-4 py-2 text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors duration-200 hover:enabled:bg-blue-200 hover:enabled:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={!canGoNext.value}
          onClick={() => model.nextTask()}
          className="flex-none px-4 py-2 text-sm border border-gray-500 rounded bg-white cursor-pointer transition-colors duration-200 hover:enabled:bg-blue-200 hover:enabled:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <div className="flex-1" />
      </div>
    </div>
  );
}
