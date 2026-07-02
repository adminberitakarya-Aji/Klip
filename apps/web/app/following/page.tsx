"use client";

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/feed/PageShell";
import { clips } from "@/data/feed";

export default function FollowingPage() {
  return (
    <PageShell title="Mengikuti" subtitle="Klip terbaru dari kreator yang kamu ikuti">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {clips.map((c) => (
          <Link
            key={c.id}
            href={`/profile/${c.handle.replace(/^@/, "")}`}
            className="group rounded-xl border border-border p-3 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-2">
              <Image src={c.avatar} alt={c.username} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{c.username}</div>
                <div className="truncate text-xs text-muted-foreground">{c.handle}</div>
              </div>
            </div>
            <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{c.caption}</div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
