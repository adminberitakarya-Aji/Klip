"use client";

import Image from "next/image";
import { PageShell } from "@/components/feed/PageShell";
import { clips } from "@/data/feed";
import { Play, TrendingUp } from "lucide-react";

const trendingTags = ["#senja", "#kuliner", "#dance", "#travel", "#diy", "#lofi", "#fashion", "#humor"];

export default function ExplorePage() {
  return (
    <PageShell title="Jelajah" subtitle="Klip yang sedang tren hari ini">
      <div className="mb-5 flex flex-wrap gap-2">
        {trendingTags.map((t) => (
          <button
            key={t}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/70"
          >
            <TrendingUp className="h-3.5 w-3.5 text-tikpink" />
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {clips.map((c) => (
          <div
            key={c.id}
            className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-secondary"
          >
            <Image
              src={c.avatar}
              alt={c.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover opacity-80 transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="line-clamp-2 text-xs font-medium">{c.caption}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-white/80">
                <Play className="h-3 w-3 fill-white" />
                {(c.likes / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
