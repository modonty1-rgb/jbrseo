function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(s: string): string {
  const escaped = escapeHtml(s);
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/**
 * Minimal Markdown → HTML for trusted admin preview only (not a full parser).
 */
export function renderMarkdown(text: string): string {
  const lines = text.split(/\n/);
  const blocks: string[] = [];
  const para: string[] = [];

  function flushPara(): void {
    if (para.length === 0) return;
    const joined = para.join("\n").trim();
    if (joined) {
      const parts = joined.split(/\n\n/).map((chunk) => {
        const withBreaks = formatInline(chunk).replace(/\n/g, "<br/>");
        return `<p class="mb-2">${withBreaks}</p>`;
      });
      blocks.push(parts.join(""));
    }
    para.length = 0;
  }

  for (const line of lines) {
    const h2 = /^## (.+)$/.exec(line);
    const h3 = /^### (.+)$/.exec(line);
    if (h2) {
      flushPara();
      blocks.push(
        `<h2 class="mt-4 mb-1 text-base font-bold">${formatInline(h2[1])}</h2>`,
      );
    } else if (h3) {
      flushPara();
      blocks.push(
        `<h3 class="mt-3 mb-1 text-sm font-semibold">${formatInline(h3[1])}</h3>`,
      );
    } else if (line.trim() === "---") {
      flushPara();
      blocks.push('<hr class="my-4 border-border" />');
    } else if (line.trim() === "") {
      flushPara();
    } else {
      para.push(line);
    }
  }
  flushPara();

  const html = blocks.join("");
  return html || '<p class="mb-2 text-muted-foreground">لا يوجد محتوى</p>';
}
