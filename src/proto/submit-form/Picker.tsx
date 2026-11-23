import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./picker.css";

export function Picker({
  names,
  current,
  onChange,
}: {
  names: string[];
  current: number;
  onChange: (i: number) => void;
}) {
  const hl = useRef<HTMLSpanElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  const move = () => {
    const el = items.current[current];
    if (!el || !hl.current) return;
    hl.current.style.width = `${el.offsetWidth}px`;
    hl.current.style.transform = `translateX(${el.offsetLeft}px)`;
  };
  useLayoutEffect(move, [current]);
  useEffect(() => {
    window.addEventListener("resize", move);
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => window.removeEventListener("resize", move);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= names.length) onChange(n - 1);
      else if (e.key === "ArrowRight") onChange((current + 1) % names.length);
      else if (e.key === "ArrowLeft") onChange((current - 1 + names.length) % names.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, names.length, onChange]);

  return (
    <nav
      className="proto-picker"
      aria-label="Prototype variants"
      data-ready={ready ? "" : undefined}
      data-position="top"
      style={{ top: 24, bottom: "auto" }}
    >
      <span ref={hl} className="proto-picker-highlight" aria-hidden="true" />
      {names.map((n, i) => (
        <button
          key={n}
          ref={(el) => { items.current[i] = el; }}
          className="proto-picker-item"
          data-active={i === current ? "" : undefined}
          aria-current={i === current ? "true" : undefined}
          onClick={() => onChange(i)}
        >
          {n}
        </button>
      ))}
    </nav>
  );
}
