type IconProps = {
  emoji: string;
  /** When the emoji conveys meaning (e.g. rating), add an accessible label. Omit for decoration. */
  label?: string;
};

export function Icon({ emoji, label }: IconProps) {
  if (label) {
    return (
      <span role="img" aria-label={label}>
        {emoji}
      </span>
    );
  }
  return <span aria-hidden="true">{emoji}</span>;
}
