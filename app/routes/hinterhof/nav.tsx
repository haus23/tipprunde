import { NavLink } from "react-router";

export function HinterhofNav() {
  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof">Dashboard</NavLink>
      </div>
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof/spieler">Spieler</NavLink>
      </div>
    </div>
  );
}
