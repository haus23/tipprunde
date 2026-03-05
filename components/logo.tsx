import logo from "@/public/logo.svg";

export function Logo() {
  return (
    <svg role="img" aria-label="runde.tips Logo" className="size-full fill-current">
      <use href={`${logo.src}#logo`} />
    </svg>
  );
}
