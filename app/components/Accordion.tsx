"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/app/components/icons";

export default function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-secondary/60 border-y border-secondary/60">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="font-heading text-sm font-semibold text-foreground">
                {item.title}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 text-foreground/50 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            {open && (
              <div className="pb-4 text-sm leading-6 text-foreground/70">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
