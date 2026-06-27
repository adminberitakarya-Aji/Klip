"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PageShell } from "@/components/feed/PageShell";
import { Upload as UploadIcon, Film, Hash } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/");
    }, 800);
  };

  return (
    <PageShell title="Unggah Klip" subtitle="Bagikan momenmu ke komunitas">
      <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-[280px,1fr]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[9/16] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center transition hover:border-tikpink hover:bg-secondary/50"
        >
          {file ? (
            <>
              <Film className="h-10 w-10 text-tikpink" />
              <div className="text-sm font-semibold">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB · Klik untuk ganti</div>
            </>
          ) : (
            <>
              <UploadIcon className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm font-semibold">Pilih video</div>
              <div className="text-xs text-muted-foreground">MP4 / MOV, maks 5 menit</div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </button>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Keterangan</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tulis sesuatu tentang klipmu..."
              maxLength={150}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-tikpink"
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">{caption.length}/150</div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Tagar</label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="travel, senja, lofi"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!file || submitting}
              className="rounded-full bg-tikpink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Mengunggah..." : "Unggah"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setCaption("");
                setTags("");
              }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
