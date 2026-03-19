interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div
      className="py-2.5 px-5 text-center text-xs font-bold text-primary-foreground tracking-wide"
      style={{ background: "var(--pricing-announcement-bg)" }}
    >
      🎉 {text}
    </div>
  );
}
