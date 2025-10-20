import { NavLink } from "react-router";

export function FohNav() {
  return (
    <div className="flex flex-col gap-2">
      <NavLink to="/">Tabelle</NavLink>
      <NavLink to="/spieler">Spieler</NavLink>
      <NavLink to="/spiele">Spiele</NavLink>
    </div>
  );
}
