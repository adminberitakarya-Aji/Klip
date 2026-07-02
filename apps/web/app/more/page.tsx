"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/feed/PageShell";
import {
  Settings,
  Globe,
  Shield,
  HelpCircle,
  Moon,
  LogOut,
  FileText,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Item = {
  icon: LucideIcon;
  label: string;
  to?: string;
  danger?: boolean;
  action?: "logout";
};

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Akun",
    items: [
      { icon: Settings, label: "Pengaturan", to: "/more/pengaturan" },
      { icon: Shield, label: "Privasi", to: "/more/privasi" },
      { icon: Globe, label: "Bahasa", to: "/more/bahasa" },
      { icon: Moon, label: "Tampilan", to: "/more/tampilan" },
    ],
  },
  {
    title: "Dukungan",
    items: [
      { icon: HelpCircle, label: "Bantuan", to: "/more/bantuan" },
      { icon: FileText, label: "Ketentuan & Kebijakan", to: "/more/ketentuan" },
    ],
  },
  {
    title: "Sesi",
    items: [{ icon: LogOut, label: "Keluar", danger: true, action: "logout" }],
  },
];

export default function MorePage() {
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <PageShell title="Lainnya" subtitle="Pengaturan dan opsi tambahan">
      <div className="mx-auto max-w-2xl space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {g.title}
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              {g.items.map((it, i) => {
                const cls = `flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition hover:bg-secondary/50 ${
                  i > 0 ? "border-t border-border" : ""
                } ${it.danger ? "text-tikpink" : ""}`;
                const inner = (
                  <>
                    <it.icon className="h-5 w-5" />
                    <span className="flex-1 font-medium">{it.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </>
                );
                if (it.to) {
                  return (
                    <Link key={it.label} href={it.to} className={cls}>
                      {inner}
                    </Link>
                  );
                }
                return (
                  <button
                    key={it.label}
                    onClick={() => {
                      if (it.action === "logout") setConfirmLogout(true);
                    }}
                    className={cls}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Klip?</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu akan dikeluarkan dari sesi ini dan dialihkan ke beranda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast("Berhasil keluar");
                router.push("/");
              }}
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
