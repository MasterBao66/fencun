"use client";
import { Eyebrow } from "@/components/ui";
import { SILLAGE_WORD, nameParts } from "@/lib/format";
import type { ScoredPick } from "@/lib/types";

export function AltList({ alts, onPick }: { alts: ScoredPick[]; onPick: (id: number) => void }) {
  if (!alts.length) return null;
  return (
    <div>
      <div className="flex items-center gap-3">
        <Eyebrow className="eyebrow-mute">也可以考虑</Eyebrow>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-1">
        {alts.map((a) => {
          const np = nameParts(a.perfume);
          return (
            <button
              key={a.perfume.id}
              onClick={() => onPick(a.perfume.id)}
              className="flex w-full items-baseline justify-between gap-3 border-b border-line py-3.5 text-left transition-colors hover:opacity-70"
            >
              <div className="min-w-0">
                <span className={`text-[1.05rem] text-ink ${np.primaryIsZh ? "serif font-semibold" : "disp"}`}>
                  {np.primary}
                </span>
                {np.secondary && <span className="en-italic ml-2 text-[0.8rem]">{np.secondary}</span>}
                <div className="mt-0.5 truncate text-[0.72rem] text-ink-faint">
                  {a.perfume.brandZh} · {a.perfume.styleTags[0]}
                </div>
              </div>
              <div className="disp shrink-0 text-[0.72rem] tracking-wide text-ink-soft">
                {a.usage.spraysLabel} · {SILLAGE_WORD[a.usage.socialDistance]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
