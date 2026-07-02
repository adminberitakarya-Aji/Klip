"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Share2,
  MoreHorizontal,
  Link as LinkIcon,
  Lock,
  Heart,
  Bookmark,
  Repeat2,
  Play,
  ChevronLeft,
} from "lucide-react";
import { SideNav } from "@/components/feed/SideNav";
import { clips } from "@/data/feed";
import { cn } from "@/lib/utils";

type Tab = "videos" | "reposts" | "favorites" | "liked";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "videos", label: "Video", icon: Play },
  { id: "reposts", label: "Repost", icon: Repeat2 },
  { id: "favorites", label: "Favorit", icon: Bookmark },
  { id: "liked", label: "Disukai", icon: Heart },
];

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const handle = (params.handle as string).replace(/^@/, "");
  const [tab, setTab] = useState<Tab>("videos");
  const [following, setFollowing] = useState(false);

  const user = clips.find(
    (c) => c.handle.replace(/^@/, "").toLowerCase() === handle.toLowerCase(),
  );

  if (!user) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Akun tidak ditemukan</h1>
          <Link href="/" className="mt-3 inline-block text-tikpink underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  const userVideos = clips;
  const followers = user.likes * 4;
  const followingCount = 312;
  const totalLikes = clips.reduce((s, c) => s + c.likes, 0);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <SideNav />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Header sticky khusus mobile */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-2 py-2 backdrop-blur md:hidden">
          <button
            onClick={handleBack}
            aria-label="Kembali"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 truncate text-base font-semibold">
            {user.handle.replace(/^@/, "")}
          </div>
          <button
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
          >
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          {/* Profile header */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Image
              src={user.avatar}
              alt={`Avatar ${user.username}`}
              width={128}
              height={128}
              className="h-28 w-28 shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {user.handle.replace(/^@/, "")}
              </h1>
              <div className="mt-1 text-lg font-medium text-foreground/85">
                {user.username}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={cn(
                    "rounded-md px-6 py-2 text-sm font-semibold transition",
                    following
                      ? "border border-border bg-secondary text-foreground hover:bg-secondary/70"
                      : "bg-tikpink text-primary-foreground hover:opacity-90",
                  )}
                >
                  {following ? "Mengikuti" : "Ikuti"}
                </button>
                <Link
                  href={`/inbox?chat=${user.handle.replace(/^@/, "")}`}
                  className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/70"
                >
                  Pesan
                </Link>
                <button
                  aria-label="Bagikan"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary hover:bg-secondary/70"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  aria-label="Lainnya"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary hover:bg-secondary/70"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-6 text-sm">
                <div>
                  <span className="font-bold text-foreground">{formatCount(followingCount)}</span>{" "}
                  <span className="text-muted-foreground">Mengikuti</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">{formatCount(followers)}</span>{" "}
                  <span className="text-muted-foreground">Pengikut</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">{formatCount(totalLikes)}</span>{" "}
                  <span className="text-muted-foreground">Suka</span>
                </div>
              </div>

              <p className="mt-4 max-w-prose text-sm leading-relaxed text-foreground/85">
                {user.caption}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-tikcyan">
                <LinkIcon className="h-3.5 w-3.5" />
                <a
                  href={`https://klip.app/${user.handle}`}
                  className="hover:underline"
                  rel="noreferrer noopener"
                >
                  klip.app/{user.handle}
                </a>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="mt-8 border-b border-border">
            <div className="flex items-center justify-around sm:justify-start sm:gap-8">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-2 py-3 text-sm font-semibold transition",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {tab === "videos" ? (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {userVideos.map((c) => (
                <div
                  key={c.id}
                  className="group relative aspect-[9/16] overflow-hidden rounded-md bg-black"
                >
                  <video
                    src={c.videoUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      const v = e.currentTarget;
                      v.pause();
                      v.currentTime = 0;
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-2 text-xs font-semibold text-white">
                    <span className="line-clamp-2">{c.caption}</span>
                  </div>
                  <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 text-xs font-bold text-white drop-shadow">
                    <Play className="h-3 w-3 fill-white" />
                    {formatCount(c.likes)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState tab={tab} />
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const labels: Record<Tab, { title: string; sub: string }> = {
    videos: { title: "Belum ada video", sub: "" },
    reposts: { title: "Belum ada repost", sub: "Video yang dibagikan ulang akan muncul di sini." },
    favorites: {
      title: "Favoritmu privat",
      sub: "Video yang kamu favoritkan hanya bisa dilihat olehmu.",
    },
    liked: {
      title: "Video yang disukai privat",
      sub: "Video yang kamu sukai disembunyikan dari pengguna lain.",
    },
  };
  const l = labels[tab];
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold">{l.title}</h3>
      {l.sub && <p className="max-w-sm text-sm text-muted-foreground">{l.sub}</p>}
    </div>
  );
}
