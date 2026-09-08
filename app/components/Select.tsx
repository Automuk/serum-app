"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/app/components/icons";

export type SelectOption = { label: string; value: string };

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function Select({
  value,
  onChange,
  options,
  className = "",
  containerClassName = "",
  disabled,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={`relative ${containerClassName}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...rest}
        className={`flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <ChevronDownIcon
          aria-hidden
          className={`h-3 w-3 shrink-0 text-foreground/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 max-h-64 w-full min-w-max overflow-auto rounded-2xl border border-secondary bg-card p-1.5 text-sm shadow-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`cursor-pointer rounded-full px-3 py-2 transition-colors ${
                opt.value === value
                  ? "bg-primary-dark text-background"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

