"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronUp,
  ChevronDown,
  Coins,
  Smartphone,
  User,
  Settings,
  Globe,
  Moon,
  HelpCircle,
  Keyboard,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipCard } from "@/components/feed/ClipCard";
import { DesktopClipView } from "@/components/feed/DesktopClipView";
import { TopBar } from "@/components/feed/TopBar";
import { BottomNav } from "@/components/feed/BottomNav";
import { SideNav } from "@/components/feed/SideNav";
import { clips } from "@/data/feed";

export default function FeedPage() {
  const [index, setIndex] = useState(0);
  const clip = clips[index];
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(clips.length - 1, i + 1));

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <SideNav />

      {/* Mobile */}
      <main className="relative mx-auto h-full w-full max-w-md overflow-hidden bg-black md:hidden">
        <TopBar />
        <div className="scroll-snap-y no-scrollbar h-full overflow-y-scroll">
          {clips.map((c) => (
            <div key={c.id} className="h-[100dvh] w-full">
              <ClipCard clip={c} />
            </div>
          ))}
        </div>
        <BottomNav />
      </main>

      {/* Desktop: single centered video like tiktok.com */}
      <main className="relative hidden flex-1 min-w-0 md:block">
        {/* Top-right utility bar */}
        <div className="absolute right-6 top-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toast("Isi ulang koin akan segera tersedia")}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary"
          >
            <Coins className="h-4 w-4" /> Get Coins
          </button>
          <button
            onClick={() => toast("Tautan unduh aplikasi dikirim")}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary"
          >
            <Smartphone className="h-4 w-4" /> Get App
          </button>
          <div className="ml-1 h-px w-px bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Menu profil"
                className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-tikpink text-sm font-bold text-primary-foreground outline-none ring-tikpink/40 focus-visible:ring-2"
              >
                K
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile/lunapark" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Lihat profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Pengaturan akan segera tersedia")}>
                <Settings className="mr-2 h-4 w-4" /> Pengaturan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Bahasa: Indonesia")}>
                <Globe className="mr-2 h-4 w-4" /> Bahasa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Mode gelap aktif")}>
                <Moon className="mr-2 h-4 w-4" /> Mode gelap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Pusat bantuan")}>
                <HelpCircle className="mr-2 h-4 w-4" /> Umpan balik & bantuan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Pintasan keyboard")}>
                <Keyboard className="mr-2 h-4 w-4" /> Pintasan keyboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.success("Berhasil keluar")}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centered tiktok-style stage */}
        <div className="flex h-full items-start justify-center px-6 pt-6">
          <DesktopClipView key={clip.id} clip={clip} />
        </div>

        {/* Up/Down controls — far right edge */}
        <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Sebelumnya"
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/70 disabled:opacity-40 cursor-pointer"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={index === clips.length - 1}
            aria-label="Berikutnya"
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/70 disabled:opacity-40 cursor-pointer"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
