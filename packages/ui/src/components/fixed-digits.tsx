type FixedDigitsProps = {
  value: string | number;
  className?: string;
};

/**
 * A number whose digits all take the same width, so a column of them lines
 * up — for display faces without tabular figures, where `tabular-nums` does
 * nothing (Anton's "1" is two thirds as wide as its other digits). Each digit
 * sits centered in its own box; anything else (a decimal comma) keeps its
 * natural width. The box adds the tracking the cells used to set, so callers
 * drop `tracking-*` and `tabular-nums`.
 *
 * Screen readers get the number as one piece from a visually hidden copy —
 * split into boxes, some would read "5 1" instead of "51".
 */
export function FixedDigits({ value, className }: FixedDigitsProps) {
  const text = String(value);
  return (
    <span className={className}>
      {/* Not selectable, or copying a table row would carry every number
          twice ("5151"). user-select does not touch the accessibility tree. */}
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden="true">
        {Array.from(text, (char, i) =>
          /\d/.test(char) ? (
            <span key={i} className="inline-block w-[0.55em] text-center tracking-normal">
              {char}
            </span>
          ) : (
            char
          ),
        )}
      </span>
    </span>
  );
}
