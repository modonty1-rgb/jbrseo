const BASE = "https://themexriver.com/wp/fladient/wp-content/uploads/2024/07";
const CLOUDINARY_LOGO =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";
const CLOUDINARY_AVATAR =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771979297/modonatyAvatar_scfhac.png";

export const landingImages = {
  pricing: [`${BASE}/p2-img-1.webp`, `${BASE}/p2-img-2.webp`],
  testimonial: [`${BASE}/t1-author-6.webp`, `${BASE}/t1-author-4.webp`, `${BASE}/t1-author-3.webp`],
  company: `${BASE}/b2-img-2.webp`,
  logoWhite: CLOUDINARY_LOGO,
  contactAvatar: CLOUDINARY_AVATAR,
} as const;
