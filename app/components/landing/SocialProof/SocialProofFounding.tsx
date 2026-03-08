type SocialProofFoundingProps = {
  text: string;
};

export function SocialProofFounding({ text }: SocialProofFoundingProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 text-[12px] font-semibold text-muted-foreground"
      style={{ animation: "fadeUp .5s .4s ease both", opacity: 0 }}
    >
      <span className="h-px w-8 bg-border" aria-hidden />
      {text}
      <span className="h-px w-8 bg-border" aria-hidden />
    </div>
  );
}
