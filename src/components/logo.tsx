import logoUrl from "@/assets/logo.svg?no-inline";

export function Logo() {
  return (
    <svg role="img" aria-label="runde.tips Logo" className="size-full fill-current">
      <use href={`${logoUrl}#logo`} />
    </svg>
  );
}
