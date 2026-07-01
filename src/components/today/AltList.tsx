"use client";
import { Eyebrow } from "@/components/ui";
import { SILLAGE_WORD, nameParts } from "@/lib/format";
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
    <div className="flex flex-col px-1">
      <Eyebrow className="pb-1">也可以考虑</Eyebrow>
      <div className="flex flex-col">
        {alts.map((a, i) => {
          const np = nameParts(a.perfume);
          return (
            <button
              key={a.perfume.id}
              onClick={() => onPick(a.perfume.id)}
              className="group flex items-baseline gap-3 border-t border-line py-3 text-left"
            >
              <span className="tnum w-6 shrink-0 text-[0.82rem] italic text-ink-faint">
                {String(i + 2).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span
                  className={`text-[1.06rem] text-ink transition-colors group-hover:text-oxblood ${
                    np.primaryIsZh ? "serif" : "font-display"
                  }`}
                >
                  {np.primary}
                </span>
                {np.secondary && (
                  <span className="ml-2 font-display text-[0.76rem] italic text-ink-faint">
                    {np.secondary}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-[0.72rem] text-ink-faint">
                {a.perfume.styleTags[0]} · {SILLAGE_WORD[a.usage.socialDistance]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
