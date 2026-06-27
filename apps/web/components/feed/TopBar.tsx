import { Search, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useGlobalMuted } from "./ClipCard"; // ✅ ADDED: ambil hook dari ClipCard

export function TopBar() {
  const [tab, setTab] = useState<"fyp">("fyp");
  const navigate = useNavigate();
  const [muted, setMuted] = useGlobalMuted(); // ✅ ADDED: mute global state

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-3">

      {/* ✅ GANTI: left slot → tombol Mute (persis TikTok) */}
      <button
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Suarakan" : "Bisukan"}
        aria-pressed={!muted}
        className="pointer-events-auto grid h-10 w-10 place-items-center text-white active:scale-90 transition cursor-pointer"
      >
        {muted
          ? <VolumeX className="h-5 w-5 drop-shadow" />
          : <Volume2 className="h-5 w-5 drop-shadow" />
        }
      </button>

      {/* Center: tab navigasi */}
      <nav className="pointer-events-auto flex items-center gap-5 text-sm font-semibold text-white/70">
        <Link
          to="/live"
          className="relative pb-1 transition hover:text-white"
        >
          LIVE
        </Link>
        <Link
          to="/following"
          className="relative pb-1 transition hover:text-white"
        >
          Mengikuti
        </Link>
        <button
          onClick={() => setTab("fyp")}
          className={cn(
            "relative pb-1 transition",
            tab === "fyp" && "text-white",
          )}
        >
          Untukmu
          {tab === "fyp" && (
            <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white" />
          )}
        </button>
      </nav>

      {/* Right: tombol Search */}
      <button
        onClick={() => navigate({ to: "/explore" })}
        aria-label="Cari"
        className="pointer-events-auto grid h-10 w-10 place-items-center text-white"
      >
        <Search className="h-5 w-5" />
      </button>
    </header>
  );
}
