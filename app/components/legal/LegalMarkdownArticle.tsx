"use client";

import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";

type LegalMarkdownArticleProps = {
  content: string;
};

export function LegalMarkdownArticle({
  content,
}: LegalMarkdownArticleProps): ReactElement {
  return (
    <article className="prose prose-invert max-w-none text-right prose-p:leading-loose prose-p:text-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
