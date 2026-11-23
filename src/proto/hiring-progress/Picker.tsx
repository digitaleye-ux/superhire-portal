import { useEffect, useLayoutEffect, useRef } from "react";
import "./Picker.css";

export interface PickerVariant {
  name: string;
  axis: string;
}

interface PickerProps {
  variants: PickerVariant[];
  current: number;
  onChange: (index: number) => void;
}

export function Picker({ variants, current, onChange }: PickerProps) {
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update sliding highlight position
  const updateHighlight = () => {
    const el = itemsRef.current[current];
    const highlight = highlightRef.current;
    if (el && highlight) {
      highlight.style.width = `${el.offsetWidth}px`;
      highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  };

  useLayoutEffect(() => {
    updateHighlight();
  }, [current, variants]);

  // Enable animation after initial paint (data-ready)
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pickerRef.current?.setAttribute("data-ready", "");
      });
    });
    window.addEventListener("resize", updateHighlight);
    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("resize", updateHighlight);
    };
  }, []);

  // Keyboard navigation: 1-N, Left/Right
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) {
        e.preventDefault();
        onChange(num - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange((current + 1) % variants.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange((current - 1 + variants.length) % variants.length);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [current, variants.length, onChange]);

  return (
    <nav ref={pickerRef} className="proto-picker" aria-label="Hiring progress prototype variants">
      <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
      {variants.map((v, i) => {
        const isActive = i === current;
        return (
          <button
            key={v.name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={isActive ? "" : undefined}
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(i)}
            title={`Switch to ${v.name} (${v.axis}) - Press ${i + 1}`}
          >
            <span className="proto-picker-num">{i + 1}</span>
            <span>{v.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
