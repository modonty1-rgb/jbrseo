export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Amiri:wght@700&display=swap');
  .font-tajawal { font-family: 'Tajawal', system-ui, sans-serif; }
  .font-amiri   { font-family: 'Amiri', serif; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUpFeatured {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(-18px); }
  }
  .anim-card     { animation: fadeUp 0.5s ease both; }
  .anim-featured { animation: fadeUpFeatured 0.55s ease both; animation-delay: 0.19s; }
  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.12s; }
  .delay-3 { animation-delay: 0.19s; }
  .delay-4 { animation-delay: 0.26s; }
  .featured-lift { transform: translateY(-18px); }
  .featured-lift:hover { transform: translateY(-22px); }
`;
