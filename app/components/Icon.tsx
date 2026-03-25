import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Clapperboard,
  ClipboardList,
  Clock,
  Coins,
  DatabaseBackup,
  Gift,
  Globe2,
  Laptop,
  Link2,
  Lock,
  Mail,
  MessageCircle,
  Palette,
  PenLine,
  Rocket,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

type IconProps = {
  emoji: string;
  label?: string;
  className?: string;
};

const iconMap: Record<string, LucideIcon> = {
  "🏢": Building2,
  "✍️": PenLine,
  "📊": BarChart3,
  "🔍": Search,
  "📧": Mail,
  "🎯": Target,
  "👥": Users,
  "🛡️": ShieldCheck,
  "🔗": Link2,
  "🔒": Lock,
  "↩️": RotateCcw,
  "💬": MessageCircle,
  "🇸🇦": Globe2,
  "🇪🇬": Globe2,
  "📤": DatabaseBackup,
  "⚡": Zap,
  "💸": TrendingDown,
  "⏱️": Clock,
  "🤖": Bot,
  "📈": TrendingUp,
  "🏆": Trophy,
  "📋": ClipboardList,
  "🚀": Rocket,
  "🎁": Gift,
  "✅": CheckCircle2,
  "✦": Sparkles,
  "✓": Check,
  "🎨": Palette,
  "📱": Smartphone,
  "🎬": Clapperboard,
  "💻": Laptop,
  "💰": Coins,
};

export function Icon({ emoji, label, className = "w-5 h-5 shrink-0 opacity-80" }: IconProps) {
  const LucideIconComp = iconMap[emoji];
  if (!LucideIconComp) {
    return (
      <span role="img" aria-label={label} className={className}>
        {emoji}
      </span>
    );
  }

  return (
    <span aria-label={label} className="inline-flex items-center justify-center">
      <LucideIconComp className={className} aria-hidden={label ? "false" : "true"} />
    </span>
  );
}
