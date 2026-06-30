"use client";
import { ReactNode } from "react";
import type { ScentColor } from "@/lib/scentColor";
import { rgba } from "@/lib/scentColor";

// 香气球 —— 签名视觉：每瓶香的专属色光晕
export function ScentOrb({ sc, size = 60 }: { sc: ScentColor; size?: number }) {
  return (
    <span
      aria-hidden
      className="aura-breathe block rounded-full"
      style={{
        width: size,
        height: size,
        background: sc.orb,
        boxShadow: `0 6px 22px -6px ${rgba(sc.primary, 0.55)}, inset 0 1px 4px rgba(255,255,255,0.4)`,
      }}
    />
  );
}

// 香气小点 —— 列表行的微缩身份
export function ScentDot({ sc, size = 9 }: { sc: ScentColor; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: sc.orb, boxShadow: `0 1px 4px -1px ${rgba(sc.primary, 0.5)}` }}
    />
  );
}

// 香气带 —— 取代绿色进度条，按主香调强度上色分段
export function ScentRibbon({ sc }: { sc: ScentColor }) {
  if (!sc.ribbon.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-[7px] overflow-hidden rounded-pill bg-sunken">
        {sc.ribbon.map((seg, i) => (
          <span
            key={i}
            className="bar-grow h-full"
            style={{ width: `${seg.pct}%`, background: seg.color, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[0.66rem] text-ink-faint">
        <span>{sc.ribbon.map((s) => s.zh).join(" · ")}</span>
        <span className="eyebrow !tracking-[0.22em]">香气成色</span>
      </div>
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

// 证据条：把 0..1 的匹配度渲染成一次性生长的横条
export function EvidenceBar({
  label,
  value,
  hint,
  tone = "brand",
}: {
  label: string;
  value: number; // 0..1
  hint?: string;
  tone?: "brand" | "accent" | "warn";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const color =
    tone === "accent" ? "var(--color-accent)" : tone === "warn" ? "var(--color-warn)" : "var(--color-brand)";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.82rem] text-ink-soft">{label}</span>
        {hint && <span className="text-[0.72rem] text-ink-faint">{hint}</span>}
      </div>
      <div className="h-[5px] w-full overflow-hidden rounded-pill bg-sunken">
        <div
          className="bar-grow h-full rounded-pill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// 香调条：中文香调 + 0..100 强度
export function AccordBar({ zh, strength }: { zh: string; strength: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-right text-[0.8rem] text-ink-soft">{zh}</span>
      <div className="h-[5px] flex-1 overflow-hidden rounded-pill bg-sunken">
        <div
          className="bar-grow h-full rounded-pill"
          style={{ width: `${strength}%`, backgroundColor: "var(--color-brand-soft)" }}
        />
      </div>
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="eyebrow">{label}</span>
      <span className="text-base font-medium text-ink">{value}</span>
      {sub && <span className="text-[0.72rem] leading-tight text-ink-faint">{sub}</span>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center py-1">
      <span className="h-1 w-1 rotate-45 bg-accent/60" />
    </div>
  );
}
