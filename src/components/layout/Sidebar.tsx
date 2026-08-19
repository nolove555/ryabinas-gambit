// src/components/layout/Sidebar.tsx — full replace
import { Home, Library, Bookmark, User, Settings, Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

import { usePlayers } from "../../hooks/usePlayers";
import { useGames } from "../../hooks/useGames";

function Sidebar() {
  const { players } = usePlayers();
  const { games } = useGames();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-80 border-r border-[#3a2a18] bg-[#080a09] text-[#d8c7a5] md:block">
      <div className="flex h-full flex-col px-6 py-8">
        <Link to="/" className="shrink-0 border-b border-[#2c2116] pb-6">
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
        </Link>

        <div className="flex min-h-0 flex-1 flex-col py-8">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <p className="font-serif text-[10px] tracking-[0.2em] text-[#806c4e]">
              GRANDMASTERS
            </p>

            <Link
              to="/players/add"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#49351f] text-[#a78b5a] transition-colors hover:bg-[#17130f]"
              title="Add Grandmaster"
            >
              <Plus size={12} />
            </Link>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="space-y-1">
              {players.map((player) => {
                const gameCount = games.filter(
                  (game) => game.white === player.name || game.black === player.name
                ).length;

                return (
                  <Link
                    key={player.id}
                    to={`/players/${player.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#17130f]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#493822] bg-[#1b1915] text-xs text-[#b9a27d]">
                        {player.imageUrl ? (
                          <img src={player.imageUrl} alt={player.name} className="h-full w-full object-cover" />
                        ) : (
                          "♟"
                        )}
                      </div>

                      <div>
                        <p className="font-serif text-sm text-[#d4c4a6]">
                          {player.name}
                        </p>
                        <p className="text-[11px] text-[#766b5a]">Games</p>
                      </div>
                    </div>

                    <span className="font-serif text-sm text-[#b73527]">
                      {gameCount}
                    </span>
                  </Link>
                );
              })}

              {players.length === 0 && (
                <p className="px-3 py-2 font-serif text-xs text-[#5f5649]">
                  No grandmasters yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <nav className="shrink-0 border-t border-[#2c2116] pt-4">
          <NavItem to="/" icon={<Home size={16} />} label="Home" />
          <NavItem to="/games" icon={<Library size={16} />} label="Library" />
          <NavItem to="/analysis" icon={<Bookmark size={16} />} label="Saved" />
          <NavItem to="/about" icon={<User size={16} />} label="Profile" />
          <NavItem to="/settings" icon={<Settings size={16} />} label="Settings" />
        </nav>
      </div>
    </aside>
  );
}

type NavItemProps = { to: string; icon: React.ReactNode; label: string };

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