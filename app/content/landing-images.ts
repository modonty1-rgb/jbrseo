import { cl } from "@/helpers/cloudinary";

const CLOUDINARY_LOGO = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg"
);

const AVATAR_FALLBACK_OPTIMIZED = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/w_96,c_fill,g_face/v1771979297/modonatyAvatar_scfhac.png"
);

export const landingImages = {
  logoWhite: CLOUDINARY_LOGO,
  logoLight: CLOUDINARY_LOGO,
  contactAvatar:
    process.env.NEXT_PUBLIC_AVATAR_FALLBACK_URL ?? AVATAR_FALLBACK_OPTIMIZED,
} as const;
