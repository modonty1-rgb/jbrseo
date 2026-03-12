import { Suspense } from "react";
import Link from "@/app/components/link";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { EmojiGrid } from "./EmojiGrid";

const EMOJI_LIST = [
  "📈", "✍️", "✍", "🎯", "🔍", "🏆", "👥", "📋", "🚀", "🔗", "💸", "⏱️", "🤖", "🔒", "↩️", "🇪🇬", "🇸🇦", "📤", "⚡", "✅", "📧",
  "🏢", "📊", "🎁", "👋", "☎️", "✦", "🛡️", "👤", "📱", "💡", "🎉", "🔥", "⭐", "💼", "📝", "🔔", "🌐", "📌", "💰",
  "➡️", "✔️", "❌", "⚠️", "ℹ️", "🔑", "📂", "📅", "⏰", "🏠", "📞", "✉️", "🌍", "📢", "🎨", "🔐", "👀", "💪", "❤️", "👍",
];

const EMOJI_NAMES: Record<string, string> = {
  "📈": "chart increasing", "✍️": "writing hand", "✍": "writing hand", "🎯": "direct hit", "🔍": "magnifying glass",
  "🏆": "trophy", "👥": "busts in silhouette", "📋": "clipboard", "🚀": "rocket", "🔗": "link", "💸": "money with wings",
  "⏱️": "stopwatch", "🤖": "robot", "🔒": "locked", "↩️": "right arrow curving left", "🇪🇬": "Egypt", "🇸🇦": "Saudi Arabia",
  "📤": "outbox tray", "⚡": "high voltage", "✅": "check mark button", "📧": "e-mail", "🏢": "building", "📊": "bar chart",
  "🎁": "wrapped gift", "👋": "waving hand", "☎️": "telephone", "🛡️": "shield", "👤": "bust in silhouette", "📱": "mobile phone",
  "💡": "light bulb", "🎉": "party popper", "🔥": "fire", "⭐": "star", "💼": "briefcase", "📝": "memo", "🔔": "bell",
  "🌐": "globe with meridians", "📌": "pushpin", "💰": "money bag", "➡️": "right arrow", "✔️": "check mark", "❌": "cross mark",
  "⚠️": "warning", "ℹ️": "information", "🔑": "key", "📂": "open folder", "📅": "calendar", "⏰": "alarm clock",
  "🏠": "house", "📞": "telephone receiver", "✉️": "envelope", "🌍": "globe showing Europe-Africa", "📢": "megaphone",
  "🎨": "artist palette", "🔐": "locked with key", "👀": "eyes", "💪": "flexed biceps", "❤️": "red heart", "👍": "thumbs up",
};

function toUnicode(emoji: string): string {
  const code = emoji.codePointAt(0);
  if (code == null) return "—";
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}

export default function AdminEmojisPage() {
  const items = EMOJI_LIST.map((emoji) => ({
    emoji,
    code: toUnicode(emoji),
    name: EMOJI_NAMES[emoji] ?? "",
  }));

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">مرجع الرموز التعبيرية (Emoji)</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        انسخ الرمز واستخدمه في حقول الأيقونة (icon) في المحتوى — مثل landing-sa.ts و landing-eg.ts
      </p>
      <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="mb-2 text-sm font-medium text-foreground">التوثيق الرسمي (Unicode)</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            <Link href="https://unicode.org/emoji/charts/full-emoji-list.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              Full Emoji List
            </Link>
            {" — القائمة الكاملة لآلاف الرموز مع الأكواد"}
          </li>
          <li>
            <Link href="https://www.unicode.org/reports/tr51/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              UTR #51 (Unicode Emoji)
            </Link>
            {" — المواصفة الرسمية"}
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          القائمة أدناه مختارة للاستخدام السريع في المحتوى. للبحث عن أي رمز أو نسخه استخدم الرابط الأول.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <EmojiGrid items={items} />
      </div>
    </div>
  );
}
