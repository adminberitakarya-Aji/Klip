"use client";

import Link from "next/link";
import { PageShell } from "@/components/feed/PageShell";
import { clips } from "@/data/feed";
import { UserPlus, MessageSquare } from "lucide-react";

export default function FriendsPage() {
  return (
    <PageShell title="Teman" subtitle="Terhubung dengan kontak dan teman barumu">
      <div className="space-y-2">
        {clips.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-border p-3"
          >
            <Link
              href={`/profile/${c.handle.replace(/^@/, "")}`}
              className="shrink-0"
            >
              <img src={c.avatar} alt={c.username} className="h-12 w-12 rounded-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{c.username}</div>
              <div className="truncate text-xs text-muted-foreground">{c.handle}</div>
            </div>
            <Link
              href="/inbox"
              aria-label="Kirim pesan"
              className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
            >
              <MessageSquare className="h-4 w-4" />
            </Link>
            <button className="flex items-center gap-1 rounded-full bg-tikpink px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
              <UserPlus className="h-3.5 w-3.5" />
              Ikuti
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
