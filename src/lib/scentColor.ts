// 香气成色 —— 把一瓶香的主香调映射成它的专属色光晕与香气带（签名视觉）
import type { Perfume } from "./types";

// 香调家族 → 基色（按家族归类，避免逐个维护 76 个）
const FAMILIES: { hex: string; set: string[] }[] = [
  { hex: "#b8893f", set: ["amber", "woody", "sandalwood", "cedar", "oud", "resinous", "balsamic", "leather", "suede", "incense", "warm spicy", "benzoin", "tobacco"] }, // 暖木琥珀
  { hex: "#c2904f", set: ["sweet", "caramel", "honey", "vanilla", "chocolate", "cacao", "coffee", "almond", "nutty", "coconut", "gourmand"] }, // 美食暖甜
  { hex: "#c47b54", set: ["fruity", "tropical", "cherry", "pear", "wine", "rum", "whiskey", "champagne"] }, // 暖果香
  { hex: "#bf7a4e", set: ["spicy", "cinnamon", "soft spicy", "fresh spicy"] }, // 辛香
  { hex: "#a9ad55", set: ["citrus"] }, // 柑橘黄绿
  { hex: "#6f9e64", set: ["green", "herbal", "aromatic", "lavender", "conifer", "mossy", "earthy", "tea", "fresh"] }, // 绿叶草本
  { hex: "#4fa39a", set: ["aquatic", "marine", "ozonic", "watery", "mineral", "salty"] }, // 水生海洋
  { hex: "#c79bb1", set: ["floral", "white floral", "yellow floral", "rose", "violet", "iris", "tuberose", "jasmine", "floral spicy"] }, // 花香
  { hex: "#c2a6b0", set: ["powdery", "lactonic", "creamy", "soapy", "aldehydic", "musky"] }, // 粉感奶感
  { hex: "#857855", set: ["smoky", "animalic"] }, // 烟熏动物
];

const FALLBACK = "#9b8e72";

function accordHex(en: string): string {
  for (const f of FAMILIES) if (f.set.includes(en)) return f.hex;
  return FALLBACK;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function mix(hex: string, withHex: string, t: number): string {
  const a = hexToRgb(hex), b = hexToRgb(withHex);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface ScentColor {
  primary: string; // 主色
  orb: string; // 香气球渐变
  auraTop: string; // 卡片右上光晕基色
  auraBottom: string; // 卡片左下光晕基色
  ribbon: { color: string; pct: number; zh: string }[]; // 香气带分段
}

export function scentColors(p: Perfume): ScentColor {
  const top = p.accords.slice(0, 4);
  if (top.length === 0) {
    return { primary: FALLBACK, orb: `radial-gradient(circle at 35% 30%, #cabfa0, ${FALLBACK})`, auraTop: FALLBACK, auraBottom: "#37564a", ribbon: [] };
  }
  const c1 = accordHex(top[0].en);
  const c2 = top[1] ? accordHex(top[1].en) : "#37564a";
  const c3 = top[2] ? accordHex(top[2].en) : c2;
  const light = mix(c1, "#ffffff", 0.5);

  const sum = top.reduce((s, a) => s + Math.max(8, a.strength), 0);
  const ribbon = top.map((a) => ({
    color: accordHex(a.en),
    pct: Math.round((Math.max(8, a.strength) / sum) * 100),
    zh: a.zh,
  }));

  return {
    primary: c1,
    orb: `radial-gradient(circle at 35% 30%, ${light}, ${c1} 52%, ${c3} 100%)`,
    auraTop: c1,
    auraBottom: c2,
    ribbon,
  };
}
