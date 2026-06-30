"use client";
import { Eyebrow } from "@/components/ui";
import { SILLAGE_WORD } from "@/lib/format";
import type { ScoredPick } from "@/lib/types";

export function AltList({
  alts,
  onPick,
}: {
  alts: ScoredPick[];
  onPick: (id: number) => void;
}) {
  if (!alts.length) return null;
  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">也可以考虑</Eyebrow>
      <div className="flex flex-col gap-2">
        {alts.map((a) => (
          <button
            key={a.perfume.id}
            onClick={() => onPick(a.perfume.id)}
            className="card flex items-center justify-between px-4 py-3 text-left transition-colors hover:border-line-strong"
          >
            <div className="min-w-0">
              <div className="truncate font-display text-[1.02rem] text-ink">
                {a.perfume.name}
              </div>
              <div className="mt-0.5 truncate text-[0.74rem] text-ink-faint">
                {a.perfume.brandZh} · {a.perfume.styleTags[0]}
              </div>
            </div>
            <div className="ml-3 shrink-0 text-right text-[0.72rem] text-ink-soft">
              {a.usage.spraysLabel}
              <span className="mx-1 text-line-strong">·</span>
              {SILLAGE_WORD[a.usage.socialDistance]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
