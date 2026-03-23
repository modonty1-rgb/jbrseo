import type { ReactElement, CSSProperties } from "react";
import Image from "next/image";
import { heroOrbLogo } from "@/app/content/landing-images";
import { MODONTY_LOGO_URL } from "@/lib/constants";

type BarProps = {
  height: number;
  active?: boolean;
};

type DotProps = {
  top: string;
  left: string;
  delay: string;
};

function Bar({ height, active = false }: BarProps): ReactElement {
  const cls = active ? "hv-bar hv-bar-active" : "hv-bar";
  return <span className={cls} style={{ height }} />;
}

function Dot({ top, left, delay }: DotProps): ReactElement {
  const style: CSSProperties = { top, left, animationDelay: delay };
  return <span className="hv-dot" style={style} />;
}

export function HeroBrandTag(): ReactElement {
  return (
    <div className="hv-stage mx-auto w-full max-w-[420px]" aria-hidden>
      <div className="hv-btag">
        <div className="hv-btag-top">
          <span className="hv-btag-dot" />
          <Image
            src={MODONTY_LOGO_URL}
            alt="modonty"
            width={72}
            height={20}
            className="h-4 w-auto shrink-0 opacity-80"
          />
          <span className="hv-btag-prefix">مدونتي — أقوى موظف مبيعات عندك</span>
        </div>
        <p className="hv-btag-title">منصة سعودية تصنع الفرق</p>
      </div>

      <div className="hv-vis mx-auto">
        <div className="hv-ring hv-ring-outer" />
        <div className="hv-ring hv-ring-inner" />

        <div className="hv-orb">
          <Image
            src={heroOrbLogo}
            alt="لوحة تحكم مدونتي"
            width={92}
            height={92}
            sizes="92px"
            loading="lazy"
            unoptimized
            className="h-[92px] w-[92px] object-contain object-center"
          />
        </div>

        <div className="hv-bars">
          <Bar height={19} />
          <Bar height={27} />
          <Bar height={22} />
          <Bar height={40} active />
          <Bar height={48} active />
        </div>

        <div className="hv-fcard hv-fcard-top">
          <span className="hv-fcard-label">ترتيب جوجل</span>
          <span className="hv-fcard-val">#١</span>
        </div>

        <div className="hv-fcard hv-fcard-bottom">
          <div className="hv-fcard-row">
            <svg width={8} height={8} viewBox="0 0 8 8" fill="none" aria-hidden>
              <path
                d="M1 6l2-2 1.5 1.5L6 3l1 1"
                stroke="#6378ff"
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hv-fcard-text">+٣٨٠٪ زيارات</span>
          </div>
        </div>

        <Dot top="28%" left="22%" delay=".5s" />
        <Dot top="65%" left="68%" delay="1.2s" />
        <Dot top="18%" left="55%" delay="2s" />
      </div>

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
@keyframes hv-floatA {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-10px) rotate(3deg); }
}
@keyframes hv-floatB {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-14px) rotate(-4deg); }
}
@keyframes hv-floatOrb {
  0%,100% { transform: translate(-50%, -50%) translateY(0); }
  50%      { transform: translate(-50%, -50%) translateY(-7px); }
}
@keyframes hv-floatBars {
  0%,100% { transform: translateY(-50%); }
  50%      { transform: translateY(calc(-50% - 7px)); }
}
@keyframes hv-pulse {
  0%,100% { opacity: 1;  transform: scale(1); }
  50%      { opacity: .4; transform: scale(.75); }
}
@keyframes hv-orbitCW {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes hv-orbitCCW {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(-360deg); }
}

.hv-stage {
  width: 100%;
  max-width: 420px;
  background: #08090f;
  border-radius: 20px;
  padding: 28px 20px 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 .5px rgba(255,255,255,.07), 0 24px 56px rgba(0,0,0,.65);
  font-family: var(--font-tajawal, "Tajawal"), sans-serif;
}
.hv-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 85% 20%, rgba(46,204,143,.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 15% 80%, rgba(99,120,255,.07) 0%, transparent 70%);
}

.hv-btag {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  background: rgba(255,255,255,.05);
  border: .5px solid rgba(255,255,255,.10);
  border-radius: 18px;
  padding: 12px 16px 14px;
  margin-bottom: 18px;
  direction: rtl;
}
.hv-btag-top {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
}
.hv-btag-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #2ecc8f;
  animation: hv-pulse 2s infinite;
  flex-shrink: 0;
  display: block;
}
.hv-btag-prefix { font-size: 12px; font-weight: 700; color: #f0ece0; letter-spacing: .01em; }
.hv-btag-sep    { width: .5px; height: 13px; background: rgba(255,255,255,.15); flex-shrink: 0; display: block; }
.hv-btag-badge  { font-size: 11px; font-weight: 900; color: #051a0e; background: #2ecc8f; border-radius: 99px; padding: 3px 9px; }
.hv-btag-title {
  margin: 0;
  font-size: clamp(15px, 4.2vw, 18px);
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.02em;
  text-align: center;
  text-wrap: balance;
  background: linear-gradient(to left, #f0ece0 0%, #d4a853 45%, #2ecc8f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hv-vis { width: 230px; height: 275px; flex-shrink: 0; position: relative; }

.hv-ring { position: absolute; border-radius: 50%; top: 50%; left: 50%; }
.hv-ring-outer {
  width: 210px; height: 210px;
  border: .5px dashed rgba(212,168,83,.15);
  animation: hv-orbitCCW 28s linear infinite;
  z-index: 2;
}
.hv-ring-outer::after {
  content: ''; position: absolute;
  width: 6px; height: 6px; border-radius: 50%;
  background: #d4a853; bottom: -3px; left: 30%;
  box-shadow: 0 0 8px rgba(212,168,83,.5);
}
.hv-ring-inner {
  width: 154px; height: 154px;
  border: .5px dashed rgba(46,204,143,.2);
  animation: hv-orbitCW 18s linear infinite;
  z-index: 3;
}
.hv-ring-inner::after {
  content: ''; position: absolute;
  width: 7px; height: 7px; border-radius: 50%;
  background: #2ecc8f; top: -3.5px; left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(46,204,143,.6);
}

.hv-orb {
  position: absolute;
  width: 104px; height: 104px; border-radius: 50%;
  box-sizing: border-box;
  padding: 5px;
  background: radial-gradient(circle at 40% 35%, #1a3a26, #0a1a10);
  border: 1px solid rgba(46,204,143,.35);
  top: 50%; left: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 4;
  animation: hv-floatOrb 5s ease-in-out infinite;
  overflow: hidden;
}
.hv-orb::before {
  content: ''; position: absolute; inset: -14px; border-radius: 50%;
  background: radial-gradient(circle, rgba(46,204,143,.15) 0%, transparent 70%);
  pointer-events: none;
}

.hv-bars {
  position: absolute;
  top: 50%; left: 4px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 52px; z-index: 5;
  animation: hv-floatBars 5.5s ease-in-out infinite 2s;
  transform: translateY(-50%);
}
.hv-bar {
  width: 7px; border-radius: 2px 2px 0 0;
  background: rgba(46,204,143,.35);
  border-top: 1px solid rgba(46,204,143,.6);
  display: block;
}
.hv-bar-active { background: rgba(46,204,143,.7); border-top-color: #2ecc8f; }

.hv-fcard {
  position: absolute;
  background: rgba(14,20,32,.92);
  border: .5px solid rgba(255,255,255,.1);
  border-radius: 8px; padding: 5px 8px;
  z-index: 6; white-space: nowrap; direction: rtl;
}
.hv-fcard-top    { top: 8px;     right: 0; animation: hv-floatA 6s ease-in-out infinite; }
.hv-fcard-bottom { bottom: 14px; left: 0;  animation: hv-floatB 7s ease-in-out infinite 1s; }
.hv-fcard-label  { font-size: 9px;   color: rgba(240,236,224,.4); display: block; }
.hv-fcard-val    { font-size: 12px;  font-weight: 900; color: #2ecc8f; display: block; }
.hv-fcard-row    { display: flex; align-items: center; gap: 5px; }
.hv-fcard-text   { font-size: 9.5px; font-weight: 700; color: #f0ece0; }

.hv-dot {
  position: absolute;
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(255,255,255,.3);
  z-index: 3; display: block;
  animation: hv-pulse 3s infinite;
}
`;
