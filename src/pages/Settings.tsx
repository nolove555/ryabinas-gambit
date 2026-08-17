// src/pages/Settings.tsx — full replace
import { useState } from "react";
import { useGames } from "../hooks/useGames";
import { useToast } from "../components/ui/Toast";

function Settings() {
  const { games } = useGames();
  const { showToast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ryabina-gambit-export.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Library exported.");
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    localStorage.removeItem("ryabina-games");
    showToast("Library cleared. Reload to see changes.");
    setConfirmClear(false);
  };

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <header className="border-b border-[#2b2117] pb-8">
        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          SETTINGS
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[#d9c8aa] md:text-5xl">
          Settings
        </h1>
      </header>

      <section className="mt-8 max-w-2xl space-y-4">
        <div className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-6">
          <h2 className="font-serif text-lg text-[#d4c4a6]">
            Export Library
          </h2>
          <p className="mt-2 text-sm text-[#786d5b]">
            Download all games, variations, and analysis as JSON.
          </p>
          <button
            onClick={handleExport}
            className="mt-4 rounded-lg bg-[#594124] px-4 py-2 text-sm text-[#e1cda9] transition-colors hover:bg-[#70532d]"
          >
            Export
          </button>
        </div>

        <div className="rounded-xl border border-[#5a2820] bg-[#0c0e0d] p-6">
          <h2 className="font-serif text-lg text-[#d4c4a6]">
            Clear Library
          </h2>
          <p className="mt-2 text-sm text-[#786d5b]">
            Removes all locally stored games. Cannot be undone.
          </p>
          <button
            onClick={handleClear}
            className="mt-4 rounded-lg border border-[#49351f] px-4 py-2 text-sm text-[#b73527] transition-colors hover:bg-[#241512]"
          >
            {confirmClear ? "Click again to confirm" : "Clear all data"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;