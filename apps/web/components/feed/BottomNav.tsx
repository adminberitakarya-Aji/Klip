import { Home, Compass, Plus, Inbox, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  params?: Record<string, string>;
};

const items: (Item | { create: true; label: string; to: string })[] = [
  { icon: Home, label: "Beranda", to: "/" },
  { icon: Compass, label: "Jelajah", to: "/explore" },
  { create: true, label: "Buat", to: "/upload" },
  { icon: Inbox, label: "Pesan", to: "/inbox" },
  { icon: User, label: "Profil", to: "/profile/$handle", params: { handle: "lunapark" } },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/60 px-2 py-2 backdrop-blur-lg">
      {items.map((it, i) => {
        if ("create" in it) {
          return (
            <Link
              key={i}
              to={it.to as "/"}
              aria-label="Buat"
              className="relative grid h-8 w-12 place-items-center"
            >
              <span className="absolute inset-0 -left-1 rounded-md bg-tikcyan" />
              <span className="absolute inset-0 left-1 rounded-md bg-tikpink" />
              <span className="relative grid h-full w-full place-items-center rounded-md bg-white">
                <Plus className="h-5 w-5 text-black" strokeWidth={3} />
              </span>
            </Link>
          );
        }
        const active = it.to
          ? it.to === "/"
            ? pathname === "/"
            : pathname.startsWith(it.to.split("/$")[0])
          : false;
        const className = cn(
          "flex flex-col items-center gap-0.5 transition",
          active ? "text-tikpink" : "text-white/80",
        );
        const inner = (
          <>
            <it.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{it.label}</span>
          </>
        );
        if (it.to) {
          return (
            <Link
              key={i}
              to={it.to as "/"}
              params={it.params as never}
              className={className}
            >
              {inner}
            </Link>
          );
        }
        return (
          <button key={i} className={className}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
