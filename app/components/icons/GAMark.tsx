// Official Google Analytics logomark — inline SVG (3 shapes, original brand
// colors per Google guidelines; never recolored). Used in GA-sourced chips.
type Props = { className?: string };

export function GAMark({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <rect x="16.5" y="2" width="5.5" height="20" rx="2.75" fill="#F9AB00" />
      <rect x="9.25" y="9.5" width="5.5" height="12.5" rx="2.75" fill="#E37400" />
      <circle cx="4.75" cy="19.25" r="2.75" fill="#E37400" />
    </svg>
  );
}
