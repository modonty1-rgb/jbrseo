import { Icon } from "@/app/components/Icon";

type FinalCTABenefitsProps = {
  benefits: readonly string[];
};

export function FinalCTABenefits({ benefits }: FinalCTABenefitsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-x-5 gap-y-2"
      style={{ animation: "fadeUp .4s .38s ease both", opacity: 0 }}
    >
      {benefits.map((b, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-primary-foreground/65"
        >
          <span className="text-primary-foreground/70">
            <Icon emoji="✓" />
          </span>
          {b}
        </span>
      ))}
    </div>
  );
}
