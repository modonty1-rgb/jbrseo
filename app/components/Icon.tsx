import * as LucideIcons from "lucide-react";

type IconProps = {
  emoji: string;
  label?: string;
  className?: string;
};

const iconMap: Record<string, keyof typeof LucideIcons> = {
  "🏢": "Building2",
  "✍️": "PenLine",
  "📊": "BarChart3",
  "🔍": "Search",
  "📧": "Mail",
  "🎯": "Target",
  "👥": "Users",
  "🛡️": "ShieldCheck",
  "🔗": "Link2",
  "🔒": "Lock",
  "↩️": "RotateCcw",
  "💬": "MessageCircle",
  "🇸🇦": "Globe2",
  "🇪🇬": "Globe2",
  "📤": "DatabaseBackup",
  "⚡": "Zap",
  "💸": "TrendingDown", // Cost going down or rising ad costs
  "⏱️": "Clock",
  "🤖": "Bot",
  "📈": "TrendingUp",
  "🏆": "Trophy",
  "📋": "ClipboardList",
  "🚀": "Rocket",
  "🎁": "Gift",
  "✅": "CheckCircle2",
  "✦": "Sparkles",
  "✓": "Check",
  "🎨": "Palette",
  "📱": "Smartphone",
  "🎬": "Clapperboard",
  "💻": "Laptop",
  "💰": "Coins",
};

export function Icon({ emoji, label, className = "w-5 h-5 shrink-0 opacity-80" }: IconProps) {
  const iconName = iconMap[emoji];
  if (!iconName) {
    // Fallback to text if missing
    return (
      <span role="img" aria-label={label} className={className}>
        {emoji}
      </span>
    );
  }

  // @ts-ignore - Dynamic key usage
  const LucideIcon = LucideIcons[iconName] as any;
  if (!LucideIcon) return null;

  return (
    <span aria-label={label} className="inline-flex items-center justify-center">
      <LucideIcon className={className} aria-hidden={label ? "false" : "true"} />
    </span>
  );
}
