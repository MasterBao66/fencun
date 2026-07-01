"use client";
import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Eyebrow } from "@/components/ui";
import { FEEL_ZH, SEASON_ZH } from "@/lib/season";
import type { Context } from "@/lib/types";

function CityForm({ onDone }: { onDone: () => void }) {
  const { resolveByCity } = useApp();
  const [cityInput, setCityInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setBusy(true);
    setErr("");
    const ok = await resolveByCity(cityInput.trim());
    setBusy(false);
    if (ok) onDone();
    else setErr("没找到这个城市，换个写法试试");
  }
  return (
    <>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="例如：上海、杭州、成都"
          className="serif flex-1 border-b border-line-strong bg-transparent px-1 py-2 text-sm outline-none focus:border-accent"
        />
        <button type="submit" disabled={busy} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
          {busy ? "…" : "确定"}
        </button>
      </form>
      {err && <p className="mt-2 text-xs text-warn">{err}</p>}
    </>
  );
}

export function ContextBar({ ctx }: { ctx: Context | null }) {
  const { locState, resolveByCoords } = useApp();
  const [editing, setEditing] = useState(false);

  if (!ctx && locState === "locating") {
    return (
      <div className="animate-fade-in border-b border-line pb-5">
        <Eyebrow>此刻 · Now</Eyebrow>
        <p className="serif mt-2 text-sm text-ink-faint">正在感知此刻的天气与体感…</p>
      </div>
    );
  }

  if (!ctx) {
    return (
      <div className="animate-fade-in border-b border-line pb-5">
        <Eyebrow>此刻 · Now</Eyebrow>
        <p className="serif mt-2 text-sm text-ink-soft">
          没拿到你的位置。告诉我你在哪座城市，我来感知今天的天气。
        </p>
        <CityForm onDone={() => {}} />
        <button
          onClick={resolveByCoords}
          className="mt-2.5 text-xs text-ink-faint underline-offset-2 hover:underline"
        >
          或再试一次自动定位
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative border-b border-line pb-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <Eyebrow>此刻 · {ctx.city}</Eyebrow>
          <div className="serif mt-2.5 text-[1.05rem] text-ink">{ctx.weatherText}</div>
          <p className="mt-1.5 text-[0.74rem] text-ink-faint">
            湿度 {Math.round(ctx.humidity)}% · 体感{FEEL_ZH[ctx.feel]} ·{" "}
            {ctx.daypart === "day" ? "白天" : "夜晚"} · {SEASON_ZH[ctx.season]}季
          </p>
        </div>
        <div className="shrink-0 leading-none">
          <span className="disp text-[3.6rem] font-light leading-[0.78] text-ink">
            {Math.round(ctx.tempC)}
            <span className="align-top text-[1.4rem] text-accent">°</span>
          </span>
        </div>
      </div>

      <button
        onClick={() => setEditing((v) => !v)}
        className="absolute right-0 top-0 text-[0.68rem] tracking-wide text-ink-faint underline-offset-2 hover:text-ink-soft hover:underline"
      >
        换地点
      </button>

      {editing && <CityForm onDone={() => setEditing(false)} />}
    </div>
  );
}
