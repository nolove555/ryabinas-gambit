import {
  Home,
  Library,
  Bookmark,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const grandmasters = [
  { name: "Mikhail Tal", games: 122 },
  { name: "José Capablanca", games: 85 },
  { name: "Bobby Fischer", games: 67 },
  { name: "Anatoly Karpov", games: 95 },
  { name: "Magnus Carlsen", games: 210 },
  { name: "Daniel Naroditsky", games: 74 },
  { name: "Hikaru Nakamura", games: 88 },
  { name: "Boris Spassky", games: 56 },
  { name: "Daniil Dubov", games: 62 },
  { name: "Judit Polgar", games: 91 },
  { name: "Garry Kasparov", games: 143 },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-80 border-r border-[#3a2a18] bg-[#080a09] text-[#d8c7a5]">

      <div className="flex h-full flex-col px-6 py-8">

        {/* LOGO */}
        <div className="shrink-0 border-b border-[#2c2116] pb-6">
          <h1 className="font-serif text-3xl tracking-wide text-[#d8c7a5]">
            RYABINA'S
          </h1>

          <h2 className="font-serif text-4xl tracking-wide text-[#a92d20]">
            GAMBIT
          </h2>

          <p className="mt-3 font-serif text-[10px] leading-relaxed tracking-[0.2em] text-[#8e8068]">
            Human Analysis First.
            <br />
            AI's Ridiculous Analysis Second.
          </p>
        </div>


        {/* GRANDMASTERS */}
        <div className="flex min-h-0 flex-1 flex-col py-8">

          <p className="mb-4 shrink-0 font-serif text-[10px] tracking-[0.2em] text-[#806c4e]">
            GRANDMASTERS
          </p>

          {/* ONLY THIS AREA SCROLLS */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">

            <div className="space-y-1">

              {grandmasters.map((player) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#17130f]"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#493822] bg-[#1b1915] text-xs text-[#b9a27d]">
                      ♟
                    </div>

                    <div>
                      <p className="font-serif text-sm text-[#d4c4a6]">
                        {player.name}
                      </p>

                      <p className="text-[11px] text-[#766b5a]">
                        Games
                      </p>
                    </div>

                  </div>

                  <span className="font-serif text-sm text-[#b73527]">
                    {player.games}
                  </span>

                </div>
              ))}

            </div>

          </div>
        </div>


        {/* BOTTOM NAVIGATION */}
        <nav className="shrink-0 border-t border-[#2c2116] pt-4">

          <NavItem
            to="/"
            icon={<Home size={16} />}
            label="Home"
          />

          <NavItem
            to="/games"
            icon={<Library size={16} />}
            label="Library"
          />

          <NavItem
            to="/analysis"
            icon={<Bookmark size={16} />}
            label="Saved"
          />

          <NavItem
            to="/about"
            icon={<User size={16} />}
            label="Profile"
          />

          <NavItem
            to="/settings"
            icon={<Settings size={16} />}
            label="Settings"
          />

        </nav>

      </div>
    </aside>
  );
}


type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};


function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
          isActive
            ? "bg-[#3a1712] text-[#c83a2c]"
            : "text-[#776d5d] hover:bg-[#15120f] hover:text-[#cdbd9f]"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}


export default Sidebar;