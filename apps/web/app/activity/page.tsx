"use client";

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/feed/PageShell";
import { clips } from "@/data/feed";
import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";

const kinds = [
  { type: "like", icon: Heart, color: "text-tikpink", text: "menyukai klipmu" },
  { type: "comment", icon: MessageCircle, color: "text-tikcyan", text: "mengomentari klipmu" },
  { type: "follow", icon: UserPlus, color: "text-emerald-500", text: "mulai mengikutimu" },
  { type: "mention", icon: AtSign, color: "text-amber-500", text: "menyebutmu di komentar" },
] as const;

export default function ActivityPage() {
  const items = clips.map((c, i) => ({ ...c, kind: kinds[i % kinds.length] }));
  return (
    <PageShell title="Aktivitas" subtitle="Notifikasi terbaru untukmu">
      <div className="space-y-1">
        {items.map((it) => {
          const Icon = it.kind.icon;
          return (
            <Link
              key={it.id}
              href={`/profile/${it.handle.replace(/^@/, "")}`}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary/40"
            >
              <div className="relative shrink-0">
                <Image src={it.avatar} alt={it.username} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                <div className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-background ${it.kind.color}`}>
                  <Icon className="h-3 w-3 fill-current" />
                </div>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">{it.username}</span>{" "}
                <span className="text-muted-foreground">{it.kind.text}</span>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">2j</span>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
