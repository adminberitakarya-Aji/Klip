import {
  Home,
  Compass,
  Users,
  UserPlus,
  Video,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  params?: Record<string, string>;
};

const items: Item[] = [
  { icon: Home, label: "Untukmu", to: "/" },
  { icon: Compass, label: "Jelajah", to: "/explore" },
  { icon: UserPlus, label: "Mengikuti", to: "/following" },
  { icon: Users, label: "Teman", to: "/friends" },
  { icon: Video, label: "LIVE", to: "/live" },
  { icon: MessageSquare, label: "Pesan", to: "/inbox" },
  { icon: Bell, label: "Aktivitas", to: "/activity" },
  { icon: PlusSquare, label: "Unggah", to: "/upload" },
  { icon: User, label: "Profil", to: "/profile/$handle", params: { handle: "lunapark" } },
  { icon: MoreHorizontal, label: "Lainnya", to: "/more" },
];

export function SideNav() {
  return (
    <aside className="hidden md:flex h-[100dvh] w-60 lg:w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4">
      <Link href="/" className="flex items-center gap-2 px-3 pb-4">
        <img
          src="/klip-logo.png"
          alt="Klip"
          width={32}
          height={32}
          className="h-8 w-8 drop-shadow-[0_0_12px_rgba(254,44,85,0.35)]"
        />
        <span className="bg-gradient-to-r from-tikpink to-tikcyan bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Klip
        </span>
      </Link>

      <div className="mb-2 flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Cari"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <NavList />


      <div className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-muted-foreground/80">
        <div className="font-semibold text-foreground/80">Perusahaan</div>
        <div>Program</div>
        <div>Ketentuan & Kebijakan</div>
        <div className="mt-3">© {new Date().getFullYear()} Klip</div>
      </div>
    </aside>
  );
}

function NavList() {
  const pathname = usePathname();
  return (
    <nav className="mt-2 flex flex-col">
      {items.map((it) => {
        const active =
          it.to === "/"
            ? pathname === "/"
            : it.to
              ? pathname.startsWith(it.to.split("/$")[0])
              : false;
        const className = cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] font-semibold transition",
          active ? "text-tikpink" : "text-foreground/85 hover:bg-secondary",
        );
        const inner = (
          <>
            <it.icon className="h-6 w-6" />
            {it.label}
          </>
        );
        if (it.to) {
          return (
            <Link
              key={it.label}
              href={it.to?.replace(/\$handle/, it.params?.handle ?? "") as string}
              className={className}
            >
              {inner}
            </Link>
          );
        }
        return (
          <button key={it.label} className={className}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
