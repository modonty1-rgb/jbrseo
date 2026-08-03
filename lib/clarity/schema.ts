import { z } from "zod";

// ─────────────────────────────────────────────────────────────────
// Zod schema for the Clarity Data Export envelope.
// Confirmed shape (official docs):
//   [ { "metricName": "Traffic", "information": [ { <dimension>: "...",
//        "totalSessionCount": "9554", ... }, ... ] }, ... ]
// Numbers arrive as strings OR numbers depending on the field, and the set of
// keys inside each `information` row varies by metric + requested dimensions —
// so rows are validated loosely (string|number|null) and interpreted in the
// normalizer, while the envelope itself is validated strictly.
// ─────────────────────────────────────────────────────────────────

export const clarityCell = z.union([z.string(), z.number(), z.null()]);

export const clarityInformationRow = z.record(z.string(), clarityCell);

export const clarityMetric = z.object({
  metricName: z.string(),
  information: z.array(clarityInformationRow).default([]),
});

export const clarityExportResponse = z.array(clarityMetric);

export type ClarityMetric = z.infer<typeof clarityMetric>;
export type ClarityInformationRow = z.infer<typeof clarityInformationRow>;
export type ClarityExportResponse = z.infer<typeof clarityExportResponse>;
