"use client";

import { Button } from "@/app/components/ui/button";
import { redirectButton } from "@/app/components/texts";
import { ArrowLeftIcon } from "lucide-react";

export default function RedirectButton() {
  const handleRedirect = () => {
    window.location.href = "https://whitelist.jbrseo.com/";
  };

  return (
    <Button
      onClick={handleRedirect}
      size="lg"
      className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden border-0 bg-primary text-primary-foreground shadow-lg shadow-primary/50 hover:bg-primary hover:shadow-xl hover:shadow-primary/60 focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={redirectButton.ariaLabel}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary via-accent to-primary"
        aria-hidden
      />
      <span className="relative flex items-center gap-2">
        <span>{redirectButton.label}</span>
        <ArrowLeftIcon className="w-5 h-5 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform duration-300 rtl:rotate-180" />
      </span>
      <span className="absolute inset-0 -translate-x-full rtl:translate-x-full group-hover:translate-x-full rtl:group-hover:-translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-foreground/20 to-transparent pointer-events-none" aria-hidden />
    </Button>
  );
}
