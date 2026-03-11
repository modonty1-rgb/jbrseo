import { HowItWorksStepCard } from "./HowItWorksStepCard";

type Step = { num: string; icon: string; title: string; line: string; tag: string };

const hiwHoverStyles = (count: number) => `
  @media (hover: hover) {
    ${Array.from({ length: count }, (_, i) => `
    #hiw-card-${i}:hover {
      border-color: color-mix(in oklch, var(--accent) 45%, transparent);
      box-shadow: 0 12px 40px color-mix(in oklch, var(--accent) 12%, transparent);
      transform: translateY(-5px);
    }
    #hiw-card-${i}:hover .hiw-bar-${i} { opacity: 1 !important; }
    #hiw-card-${i}:hover .hiw-icon-${i} {
      background: color-mix(in oklch, var(--accent) 16%, transparent);
      border-color: color-mix(in oklch, var(--accent) 32%, transparent);
      transform: scale(1.08) rotate(-3deg);
    }
    `).join("")}
  }
`;

export function HowItWorksSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <div className="relative mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <style>{hiwHoverStyles(steps.length)}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute hidden top-9 border-t-2 border-dashed border-border lg:block"
        style={{
          insetInlineStart: "calc(33.33% + 20px)",
          insetInlineEnd:   "calc(33.33% + 20px)",
        }}
      />
      {(steps as Step[]).map((step, i) => (
        <div key={i}>
          <HowItWorksStepCard step={step} index={i} />
        </div>
      ))}
    </div>
  );
}
