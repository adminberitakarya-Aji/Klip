"use client";

import { PageShell } from "@/components/feed/PageShell";
import { clips } from "@/data/feed";
import { Eye } from "lucide-react";

export default function LivePage() {
  return (
    <PageShell title="LIVE" subtitle="Siaran langsung yang sedang berlangsung">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {clips.map((c, i) => (
          <div key={c.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
            <img src={c.avatar} alt={c.username} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-tikpink px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </div>
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <Eye className="h-3 w-3" />
              {((i + 1) * 1234).toLocaleString("id-ID")}
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="truncate text-sm font-semibold">{c.username}</div>
              <div className="line-clamp-1 text-[11px] text-white/80">{c.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
