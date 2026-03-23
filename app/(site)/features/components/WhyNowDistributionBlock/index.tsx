import type { DistributionChannel } from "./content";

import type { ReactNode } from "react";

import { Card } from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

import { DISTRIBUTION_CHANNELS, WHY_NOW_DISTRIBUTION_COPY } from "./content";

function TopHeader(): ReactNode {
  return (
    <div className="border-b border-dashed border-border px-7 pb-4 pt-5">
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{WHY_NOW_DISTRIBUTION_COPY.topIcon}</span>
        <div>
          <p className="text-[13px] font-extrabold text-foreground">{WHY_NOW_DISTRIBUTION_COPY.topTitle}</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{WHY_NOW_DISTRIBUTION_COPY.topSubtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function WhyNowDistributionBlock(): ReactNode {
  const channels = DISTRIBUTION_CHANNELS;

  return (
    <Card className="mx-auto mb-4 max-w-[960px] overflow-hidden rounded-2xl p-0 shadow-sm">
      <TopHeader />
      <div className="overflow-hidden">
        <Table className="w-full border-collapse">
          <TableCaption className="sr-only">
            {WHY_NOW_DISTRIBUTION_COPY.topTitle}
          </TableCaption>

          <TableHeader>
            <TableRow className="border-b border-border bg-muted">
              <TableHead className="px-7 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-right">
                <span className="min-w-0 truncate whitespace-nowrap text-muted-foreground">{WHY_NOW_DISTRIBUTION_COPY.headerLeft}</span>
              </TableHead>
              <TableHead className="px-7 py-2.5 text-[11px] font-bold uppercase tracking-[.08em]">
                <span className="block text-center text-destructive whitespace-nowrap">{WHY_NOW_DISTRIBUTION_COPY.headerEmployee}</span>
              </TableHead>
              <TableHead className="px-7 py-2.5 text-[11px] font-bold uppercase tracking-[.08em]">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <span className="text-emerald-500">{WHY_NOW_DISTRIBUTION_COPY.brandLabel}</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    {WHY_NOW_DISTRIBUTION_COPY.brandChip}
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {channels.map((ch, i) => {
              const isLast = i === channels.length - 1;
              return (
                <TableRow key={i} className={isLast ? "border-b-0" : "border-b border-muted"}>
                  <TableCell className="px-7 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-[17px] ${
                          ch.highlight ? "border-emerald-200 bg-emerald-50" : "border-border bg-muted"
                        }`}
                      >
                        {ch.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate whitespace-nowrap text-[13px] font-bold text-foreground">{ch.label}</p>
                        <p className="mt-0.5 truncate whitespace-nowrap text-[11px] text-muted-foreground">{ch.sub}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-7 py-3.5 text-start sm:text-center">
                    {ch.employee ? (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                        ✓ {ch.employeeNote}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-[11px] font-bold text-destructive">
                        ✗ {ch.employeeNote}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-7 py-3.5 text-start sm:text-center">
                    <span
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                        ch.highlight
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300/50"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      ✓ {ch.modontyNote}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow className="border-t border-amber-200 bg-amber-50">
              <TableCell colSpan={3} className="px-7 py-3 whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-sm shrink-0" aria-hidden="true">
                    {WHY_NOW_DISTRIBUTION_COPY.footerIcon}
                  </span>
                  <p className="min-w-0 truncate text-[12px] font-semibold leading-relaxed text-amber-800">
                    {WHY_NOW_DISTRIBUTION_COPY.footerPrefix}
                    <span className="font-extrabold text-amber-900">{WHY_NOW_DISTRIBUTION_COPY.footerPlaces}</span>
                    {WHY_NOW_DISTRIBUTION_COPY.footerMiddle}
                    <span className="font-extrabold text-amber-900">{WHY_NOW_DISTRIBUTION_COPY.footerSinglePlace}</span>
                    {WHY_NOW_DISTRIBUTION_COPY.footerSuffix}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
}

