"use client";
import { Eyebrow, EvidenceBar, Stat, ScentOrb, ScentRibbon } from "@/components/ui";
import {
  DISTANCE_LABEL,
  DISTANCE_HINT,
  durationShort,
  genderLabel,
  nameParts,
} from "@/lib/format";
import { scentColors, rgba } from "@/lib/scentColor";
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
          <span className="text-ink-soft">{arr.join(" · ")}</span>
        </div>
      ))}
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
}: {
  pick: ScoredPick;
  ctx: Context;
  isSelected: boolean;
  explainText: string;
  explainLoading: boolean;
  explainSource: string;
  onChangeBottle: () => void;
  onReset: () => void;
}) {
  const p = pick.perfume;
  const sc = scentColors(p);
  const np = nameParts(p);
  const tier = pick.usage.socialDistance;
  const weatherNorm = Math.max(0, Math.min(1, (pick.breakdown.weather - 0.7) / 0.6));

  return (
    <article key={p.id} className="card animate-fade-up relative overflow-hidden">
      {/* 香气光晕 —— 由主香调上色 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(440px 320px at 100% -12%, ${rgba(sc.auraTop, 0.22)}, transparent 60%), radial-gradient(360px 300px at -12% 116%, ${rgba(sc.auraBottom, 0.12)}, transparent 60%)`,
        }}
      />

      {/* 头部 */}
      <div className="relative px-6 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>{isSelected ? "你选了 · Your Pick" : ctx.daypart === "night" ? "今夜一喷 · Tonight" : "今日一喷 · Today"}</Eyebrow>
            {!pick.usage.suitable && (
              <span className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-warn">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                有一点要留意
              </span>
            )}
          </div>
          <ScentOrb sc={sc} size={56} />
        </div>

        <h2
          className={`mt-3 text-[1.9rem] font-medium leading-[1.1] text-ink ${
            np.primaryIsZh ? "tracking-tight" : "font-display"
          }`}
        >
          {np.primary}
        </h2>
        {np.secondary && (
          <p className="mt-1 font-display text-[1.05rem] italic text-accent">{np.secondary}</p>
        )}
        <p className="mt-2 text-[0.82rem] text-ink-faint">
          {p.brandZh} · {genderLabel(p.gender)}
          {p.year ? ` · ${p.year}` : ""}
        </p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {p.styleTags.map((tag, i) => (
            <span
              key={tag}
              className="rounded-pill px-2.5 py-0.5 text-[0.72rem]"
              style={
                i === 0
                  ? { background: rgba(sc.primary, 0.14), color: sc.primary }
                  : { border: "1px solid var(--color-line-strong)", color: "var(--color-ink-soft)" }
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AI 解读 —— 引述式 */}
      <div
        className="relative mx-6 mt-5 border-l-2 pl-4"
        style={{ borderColor: rgba(sc.primary, 0.55) }}
      >
        <p
          className={`text-[0.95rem] leading-[1.75] text-ink-soft transition-opacity duration-300 ${
            explainLoading ? "opacity-55" : "opacity-100"
          }`}
        >
          {explainText || pick.reasons[0]}
        </p>
        <div className="mt-2.5">
          <Eyebrow>
            {explainLoading
              ? "氛寸正在斟酌措辞…"
              : explainSource === "deepseek"
              ? "氛寸 · 此刻为你解读"
              : "氛寸 · 用香建议"}
          </Eyebrow>
        </div>
      </div>

      {/* 用香三件套 —— 编辑级，无重框 */}
      <div className="relative mx-6 mt-5 flex border-t border-line pt-4">
        <div className="flex-1">
          <Stat label="喷量" value={pick.usage.spraysLabel} sub="先少后补" />
        </div>
        <div className="flex-1 border-l border-line">
          <Stat label="社交距离" value={DISTANCE_LABEL[tier]} sub={DISTANCE_HINT[tier].split("，")[0].split("（")[0]} />
        </div>
        <div className="flex-1 border-l border-line">
          <Stat label="留香" value={durationShort(p.longevity)} />
        </div>
      </div>

      {/* 香气带 */}
      <div className="relative mx-6 mt-5">
        <ScentRibbon sc={sc} />
      </div>

      {/* 分寸建议（展开） */}
      <details className="group relative mx-6 mt-4">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-1.5 py-2 text-[0.82rem] text-ink-faint transition-colors hover:text-ink-soft [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">展开分寸建议</span>
          <span className="hidden group-open:inline">收起</span>
          <svg width="12" height="12" viewBox="0 0 24 24" className="transition-transform group-open:rotate-180">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </summary>

        <div className="flex flex-col gap-5 pb-2 pt-2">
          <div className="flex flex-col gap-2.5 text-[0.86rem]">
            <DetailRow label="喷在哪" value={pick.usage.placement.join("、")} />
            <DetailRow label="社交距离" value={`${DISTANCE_LABEL[tier]}（${DISTANCE_HINT[tier]}）`} />
            <DetailRow label="留香" value={pick.usage.durationHint} />
          </div>

          {pick.risks.length > 0 && (
            <div className="rounded-lg bg-warn-wash px-4 py-3">
              <Eyebrow className="!text-warn">分寸提醒</Eyebrow>
              <ul className="mt-1.5 flex flex-col gap-1">
                {pick.risks.map((r, i) => (
                  <li key={i} className="text-[0.82rem] leading-snug text-ink-soft">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Eyebrow>为什么是这些建议</Eyebrow>
            <EvidenceBar
              label="季节匹配"
              value={pick.breakdown.season}
              hint={`社区在${ctx.season === "summer" ? "夏" : ctx.season === "winter" ? "冬" : ctx.season === "spring" ? "春" : "秋"}季的投票占比`}
            />
            <EvidenceBar label="场合贴合" value={pick.breakdown.occasion} />
            <EvidenceBar
              label="天气适应"
              value={weatherNorm}
              tone={pick.breakdown.weather < 0.95 ? "warn" : "brand"}
              hint={pick.breakdown.weather >= 1.05 ? "今天更通透" : pick.breakdown.weather <= 0.95 ? "今天偏厚" : ""}
            />
          </div>

          <NotesTiers notes={p.notes} />
        </div>
      </details>

      {/* 操作 */}
      <div className="relative mt-4 flex gap-2 border-t border-line px-6 py-4">
        {isSelected && (
          <button
            onClick={onReset}
            className="flex-1 rounded-lg border border-line-strong py-2.5 text-sm text-ink-soft transition-colors hover:bg-sunken"
          >
            回到今日推荐
          </button>
        )}
        <button
          onClick={onChangeBottle}
          className="flex-1 rounded-lg bg-ink py-2.5 text-sm text-paper transition-opacity hover:opacity-90"
        >
          换一瓶
        </button>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-16 shrink-0 text-ink-faint">{label}</span>
      <span className="text-ink-soft">{value}</span>
    </div>
  );
}
