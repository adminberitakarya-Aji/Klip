import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Forward,      // ✅ GANTI: Share2 → Forward (panah TikTok-style)
  Bookmark,
  Music2,
  Play,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";
import { CommentSheet } from "./CommentSheet";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

// Global mute preference shared across all clips
const MUTE_KEY = "rippl:muted";
const muteListeners = new Set<(m: boolean) => void>();
let globalMuted = true;
if (typeof window !== "undefined") {
  globalMuted = window.localStorage.getItem(MUTE_KEY) !== "0";
}
function setGlobalMuted(m: boolean) {
  globalMuted = m;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  }
  muteListeners.forEach((fn) => fn(m));
}
export function useGlobalMuted() {
  // ✅ EXPORT: supaya TopBar bisa pakai hook ini
  const [m, setM] = useState(globalMuted);
  useEffect(() => {
    muteListeners.add(setM);
    return () => {
      muteListeners.delete(setM);
    };
  }, []);
  return [m, setGlobalMuted] as const;
}

export function ClipCard({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareCount, setShareCount] = useState(clip.shares);
  const [savesCount, setSavesCount] = useState(clip.saves); // ✅ ADDED
  const [likeBurst, setLikeBurst] = useState(0);
  const [floatHearts, setFloatHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [muted] = useGlobalMuted();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (visible && !paused && !errored) v.play().catch(() => {});
    else v.pause();
  }, [visible, paused, muted, errored]);

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikeBurst((b) => b + 1);
  };

  const togglePlay = () => setPaused((p) => !p);

  const handleDoubleTap = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setFloatHearts((arr) => [...arr, { id, x, y }]);
    setTimeout(() => setFloatHearts((arr) => arr.filter((h) => h.id !== id)), 900);
    if (!liked) {
      setLiked(true);
      setLikeBurst((b) => b + 1);
    }
  };

  const handleFollow = () => {
    setFollowed((f) => {
      const next = !f;
      toast.success(next ? `Mengikuti ${clip.username}` : `Berhenti mengikuti ${clip.username}`);
      return next;
    });
  };

  const handleSave = () => {
    setSaved((s) => {
      const next = !s;
      setSavesCount((c) => (next ? c + 1 : c - 1)); // ✅ update count
      toast.success(next ? "Disimpan ke koleksi" : "Dihapus dari simpanan");
      return next;
    });
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?clip=${clip.id}`
        : `/?clip=${clip.id}`;
    const shareData = {
      title: `${clip.username} di Klip`,
      text: clip.caption,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        setShareCount((c) => c + 1);
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Tautan disalin");
      setShareCount((c) => c + 1);
    } catch {
      // user cancelled share — no-op
    }
  };

  const retry = () => {
    setErrored(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      ref={containerRef}
      className="snap-item relative h-full w-full overflow-hidden bg-black"
    >
      <video
        key={retryKey}
        ref={videoRef}
        src={clip.videoUrl}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
        onLoadedData={() => setLoaded(true)}
        onError={() => setErrored(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        className="h-full w-full object-cover"
      />

      {/* Loading skeleton */}
      {!loaded && !errored && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-card to-secondary" />
      )}

      {/* Error state */}
      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 px-6 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden />
          <p className="text-sm text-foreground/90">Gagal memuat video.</p>
          <button
            onClick={retry}
            className="rounded-full bg-tikpink px-5 py-2 text-sm font-semibold text-primary-foreground active:scale-95"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Floating hearts on double-tap */}
      {floatHearts.map((h) => (
        <Heart
          key={h.id}
          aria-hidden
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 fill-tikpink text-tikpink animate-pulse-heart drop-shadow-2xl"
          style={{ left: h.x, top: h.y }}
        />
      ))}

      {paused && !errored && (
        <button
          onClick={togglePlay}
          aria-label="Putar"
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <Play className="h-20 w-20 fill-white text-white drop-shadow-lg" />
        </button>
      )}

      {/* ✅ HAPUS: mute button dari sini (dipindah ke TopBar) */}

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Bottom: caption & meta — ✅ FIX: username tanpa @, layout lebih TikTok */}
      <div className="absolute inset-x-0 bottom-16 px-4 pr-20 text-foreground pb-4">
        <Link
          href={`/profile/${clip.handle.replace(/^@/, "")}`}
          className="inline-block text-sm font-bold tracking-tight hover:underline"
        >
          {clip.username} {/* ✅ GANTI: clip.handle → clip.username (tanpa @) */}
        </Link>
        <p className="mt-1 line-clamp-3 text-sm leading-snug">
          {clip.caption}{" "}
          {clip.tags.map((t) => (
            <span key={t} className="font-semibold text-tikcyan">#{t} </span>
          ))}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-foreground/80">
          <Music2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <div className="relative w-44 overflow-hidden">
            <div className="animate-[marquee_12s_linear_infinite] whitespace-nowrap">
              {clip.song} · {clip.song}
            </div>
          </div>
        </div>
      </div>

      {/* Right action rail — ✅ FIX: saves count + Forward icon */}
      <div className="absolute bottom-20 right-2 z-20 flex flex-col items-center gap-5 text-foreground">
        {/* Avatar + Follow */}
        <div className="relative">
          <Link
            href={`/profile/${clip.handle.replace(/^@/, "")}`}
            aria-label={`Lihat profil ${clip.username}`}
          >
            <Image
              src={clip.avatar}
              alt={`Avatar ${clip.username}`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          </Link>
          <button
            onClick={handleFollow}
            aria-label={followed ? `Berhenti mengikuti ${clip.username}` : `Ikuti ${clip.username}`}
            aria-pressed={followed}
            className={cn(
              "absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full text-xs font-bold text-primary-foreground transition active:scale-90 cursor-pointer",
              followed ? "bg-tikcyan" : "bg-tikpink",
            )}
          >
            {followed ? <Check className="h-3 w-3" /> : "+"}
          </button>
        </div>

        {/* Like */}
        <ActionBtn
          onClick={toggleLike}
          ariaLabel="Suka"
          ariaPressed={liked}
          icon={
            <Heart
              key={likeBurst}
              className={cn(
                "h-8 w-8 transition",
                liked ? "fill-tikpink text-tikpink animate-pulse-heart" : "text-white",
              )}
            />
          }
          label={formatCount(clip.likes + (liked ? 1 : 0))}
        />

        {/* Comment */}
        <ActionBtn
          onClick={() => setCommentsOpen(true)}
          ariaLabel="Komentar"
          icon={<MessageCircle className="h-8 w-8 text-white" />}
          label={formatCount(clip.comments)}
        />

        {/* ✅ FIX: Bookmark pakai savesCount bukan "Simpan" */}
        <ActionBtn
          onClick={handleSave}
          ariaLabel="Simpan"
          ariaPressed={saved}
          icon={
            <Bookmark
              className={cn(
                "h-8 w-8",
                saved ? "fill-tikcyan text-tikcyan" : "text-white",
              )}
            />
          }
          label={formatCount(savesCount)} // ✅ GANTI: "Simpan" → angka count
        />

        {/* ✅ FIX: Share pakai Forward bukan Share2 */}
        <ActionBtn
          onClick={handleShare}
          ariaLabel="Bagikan"
          icon={<Forward className="h-8 w-8 text-white" />} // ✅ GANTI icon
          label={formatCount(shareCount)}
        />

        {/* Spinning disc */}
        <button
          onClick={() => toast(`♫ ${clip.song}`, { description: "Gunakan suara ini" })}
          aria-label={`Suara: ${clip.song}`}
          className="mt-2 h-12 w-12 animate-spin-slow rounded-full border border-white/20 bg-gradient-to-br from-tikpink to-tikcyan p-1 active:scale-90 transition cursor-pointer"
        >
          <Image
            src={clip.avatar}
            alt=""
            aria-hidden
            width={48}
            height={48}
            className="h-full w-full rounded-full border-2 border-black object-cover"
          />
        </button>
      </div>

      {/* Progress bar — ✅ FIX: bottom-0, selalu di bawah caption */}
      <div
        className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-tikcyan transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <CommentSheet clip={clip} open={commentsOpen} onOpenChange={setCommentsOpen} />
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  ariaLabel,
  ariaPressed,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className="flex flex-col items-center gap-1 active:scale-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-tikcyan rounded-md cursor-pointer"
    >
      {icon}
      <span className="text-xs font-semibold drop-shadow">{label}</span>
    </button>
  );
}
