"use client";

import Image from "next/image";
import { useThemeOptional } from "@/app/helpers/useTheme";
import { cl } from "@/helpers/cloudinary";

const FALLBACK_LIGHT = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1772803131/darrk-jbrseo_gsvavm.svg"
);
const FALLBACK_DARK = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg"
);

export default function HeaderLogoClient({
  logoLight,
  logoWhite,
}: {
  logoLight: string;
  logoWhite: string;
}) {
  const themeCtx = useThemeOptional();
  const theme = themeCtx?.theme ?? "light";
  const isDark = theme === "dark";

  const src = isDark
    ? (logoWhite?.trim() || FALLBACK_DARK)
    : (logoLight?.trim() || logoWhite?.trim() || FALLBACK_LIGHT);

  return (
    <Image
      src={src}
      alt="مدونتي"
      width={110}
      height={34}
      className="h-8 w-auto md:h-9"
      priority
    />
  );
}

