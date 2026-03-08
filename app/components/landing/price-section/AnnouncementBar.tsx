interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div
      className="py-2.5 px-5 text-center text-xs font-bold text-white tracking-wide"
      style={{ background: "linear-gradient(90deg,#6d28d9,#4f46e5)" }}
    >
      🎉 {text}
    </div>
  );
}
