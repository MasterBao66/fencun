"use client";
import { useEffect, useState } from "react";
import { Eyebrow, EvidenceBar } from "@/components/ui";
import {
  DISTANCE_LABEL,
  DISTANCE_HINT,
  durationShort,
  genderLabel,
  nameParts,
} from "@/lib/format";
import type { ScoredPick, Context } from "@/lib/types";

function NotesTiers({ notes }: { notes: ScoredPick["perfume"]["notes"] }) {
  const tiers: [string, string[]][] = [
    ["前调", notes.top],
    ["中调", notes.middle],
    ["后调", notes.base],
  ];
  const shown = tiers.filter(([, arr]) => arr.length > 0);
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow>气味档案</Eyebrow>
      {shown.map(([label, arr]) => (
        <div key={label} className="flex gap-3 text-[0.82rem]">
          <span className="w-9 shrink-0 text-ink-faint">{label}</span>
          <span className="serif text-ink-soft">{arr.join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}

function UsageStat({ k, v, s }: { k: string; v: string; s?: string }) {
  return (
    <div className="flex-1">
      <div className="eyebrow">{k}</div>
      <div className="serif mt-1.5 text-[1rem] leading-tight text-ink">{v}</div>
      {s && <div className="mt-0.5 text-[0.68rem] text-ink-faint">{s}</div>}
    </div>
  );
}

export function RecommendationCard({
  pick,
  ctx,
  isSelected,
  explainText,
  explainLoading,
  explainSource,
  onChangeBottle,
  onReset,
  onUse,
}: {
  pick: ScoredPick;
  ctx: Context;
  isSelected: boolean;
  explainText: string;
  explainLoading: boolean;
  explainSource: string;
  onChangeBottle: () => void;
  onReset: () => void;
  onUse: () => void;
}) {
  const p = pick.perfume;
  const np = nameParts(p);
  const tier = pick.usage.socialDistance;
  const accords = p.accords.slice(0, 4);
  const weatherNorm = Math.max(0, Math.min(1, (pick.breakdown.weather - 0.7) / 0.6));

  const [used, setUsed] = useState(false);
  useEffect(() => setUsed(false), [p.id]);

  return (
    <article key={p.id} className="card animate-fade-up px-6 pt-6">
      {/* kicker */}
      <div className="flex items-start gap-3">
        <span className="tnum text-[2.3rem] font-light italic leading-[0.72] text-accent">
          {isSelected ? "—" : "01"}
        </span>
        <div className="pt-0.5">
          <Eyebrow>
            {isSelected ? "你选了 · Your Pick" : ctx.daypart === "night" ? "今夜一喷 · Tonight" : "今日一喷 · Today"}
          </Eyebrow>
          <div className="mt-1 text-[0.72rem] text-ink-faint">为你此刻而选</div>
        </div>
      </div>

      {/* 香名 */}
      <h2
        className={`mt-4 leading-[1.08] text-ink ${
          np.primaryIsZh ? "serif text-[2.5rem] font-medium tracking-[0.01em]" : "font-display text-[2.1rem] font-medium"
        }`}
      >
        {np.primary}
      </h2>
      <p className="mt-2 font-display text-[1.02rem] italic text-ink-soft">
        {np.secondary ? `${np.secondary} · ${p.brand}` : p.brand}
      </p>
      <p className="mt-2 text-[0.74rem] text-ink-faint">
        {p.brandZh} · {genderLabel(p.gender)}
        {p.year ? ` · ${p.year}` : ""}
        {!pick.usage.suitable && <span className="text-warn"> · 有一点要留意</span>}
      </p>

      {/* 香调刻度（单色，编辑式） */}
      <div className="mt-5 flex gap-3.5 border-t border-line pt-4">
        {accords.map((a) => (
          <div key={a.en} className="flex-1">
            <div className="serif text-[0.84rem] text-ink">{a.zh}</div>
            <div className="mt-1.5 h-[2px] bg-line-strong/45">
              <div className="bar-grow h-full bg-ink" style={{ width: `${a.strength}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* AI 解读 —— 首字下沉 */}
      <p
        className={`dropcap serif mt-5 text-[0.95rem] font-light leading-[1.85] text-ink-soft transition-opacity duration-300 ${
          explainLoading ? "opacity-55" : "opacity-100"
        }`}
      >
        {explainText || pick.reasons[0]}
      </p>
      <div className="mt-3">
        <Eyebrow>
          {explainLoading
            ? "氛寸正在斟酌措辞…"
            : explainSource === "deepseek"
            ? "氛寸 · 此刻为你解读"
            : "氛寸 · 用香建议"}
        </Eyebrow>
      </div>

      {/* 用香三件套 —— 编辑级 */}
      <div className="mt-5 flex border-t-[1.5px] pt-4 rule-ink">
        <UsageStat k="喷量" v={pick.usage.spraysLabel} s="先少后补" />
        <div className="mx-4 w-px bg-line" />
        <UsageStat k="距离" v={DISTANCE_LABEL[tier]} s={DISTANCE_HINT[tier].split("，")[0].split("（")[0]} />
        <div className="mx-4 w-px bg-line" />
        <UsageStat k="留香" v={durationShort(p.longevity)} />
      </div>

      {/* 分寸建议（展开） */}
      <details className="group mt-4">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-1.5 py-2 text-[0.8rem] text-ink-faint transition-colors hover:text-ink-soft [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">展开分寸建议</span>
          <span className="hidden group-open:inline">收起</span>
          <svg width="11" height="11" viewBox="0 0 24 24" className="transition-transform group-open:rotate-180">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </summary>
        <div className="flex flex-col gap-5 pb-1 pt-2">
          <div className="flex flex-col gap-2.5 text-[0.86rem]">
            <DetailRow label="喷在哪" value={pick.usage.placement.join("、")} />
            <DetailRow label="社交距离" value={`${DISTANCE_LABEL[tier]}（${DISTANCE_HINT[tier]}）`} />
            <DetailRow label="留香" value={pick.usage.durationHint} />
          </div>
          {pick.risks.length > 0 && (
            <div className="rounded-md bg-warn-wash px-4 py-3">
              <Eyebrow className="!text-warn">分寸提醒</Eyebrow>
              <ul className="mt-1.5 flex flex-col gap-1">
                {pick.risks.map((r, i) => (
                  <li key={i} className="text-[0.82rem] leading-snug text-ink-soft">{r}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Eyebrow>为什么是这些建议</Eyebrow>
            <EvidenceBar label="季节匹配" value={pick.breakdown.season} hint={`社区在${ctx.season === "summer" ? "夏" : ctx.season === "winter" ? "冬" : ctx.season === "spring" ? "春" : "秋"}季的投票占比`} />
            <EvidenceBar label="场合贴合" value={pick.breakdown.occasion} />
            <EvidenceBar label="天气适应" value={weatherNorm} tone={pick.breakdown.weather < 0.95 ? "warn" : "brand"} hint={pick.breakdown.weather >= 1.05 ? "今天更通透" : pick.breakdown.weather <= 0.95 ? "今天偏厚" : ""} />
          </div>
          <NotesTiers notes={p.notes} />
        </div>
      </details>

      {/* 操作 */}
      <div className="-mx-6 mt-4 flex items-center justify-between border-t border-line px-6 py-4">
        {isSelected ? (
          <button onClick={onReset} className="font-display text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint underline-offset-4 hover:text-ink-soft hover:underline">
            回到今日推荐
          </button>
        ) : (
          <span className="text-[0.72rem] text-ink-faint">从香柜里换任意一瓶 →</span>
        )}
        <div className="flex items-center gap-4">
          <button onClick={onChangeBottle} className="font-display text-[0.72rem] uppercase tracking-[0.16em] text-ink underline underline-offset-4 hover:text-oxblood">
            换一瓶
          </button>
          <button
            onClick={() => {
              setUsed(true);
              onUse();
            }}
            className="serif rounded-[3px] bg-ink px-5 py-2 text-[0.86rem] text-paper transition-opacity hover:opacity-90"
          >
            {used ? "今天在用 ✓" : "就用它"}
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-16 shrink-0 text-ink-faint">{label}</span>
      <span className="serif text-ink-soft">{value}</span>
    </div>
  );
}
