import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Play,
  Volume2,
  VolumeX,
  AlertTriangle,
  Check,
  MoreHorizontal,
} from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";
import { CommentSheet } from "./CommentSheet";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const MUTE_KEY = "rippl:muted";
function readMuted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) !== "0";
}

export function DesktopClipView({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState<boolean>(readMuted);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [shareCount, setShareCount] = useState(clip.shares);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (!paused && !errored) v.play().catch(() => {});
    else v.pause();
  }, [paused, muted, errored, retryKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    }
  }, [muted]);

  const toggleLike = () => setLiked((l) => !l);
  const togglePlay = () => setPaused((p) => !p);

  const handleFollow = () =>
    setFollowed((f) => {
      const n = !f;
      toast.success(n ? `Mengikuti ${clip.username}` : `Berhenti mengikuti ${clip.username}`);
      return n;
    });

  const handleSave = () =>
    setSaved((s) => {
      toast.success(s ? "Dihapus dari simpanan" : "Disimpan ke koleksi");
      return !s;
    });

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?clip=${clip.id}`
        : `/?clip=${clip.id}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: clip.username, text: clip.caption, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Tautan disalin");
      }
      setShareCount((c) => c + 1);
    } catch {
      /* cancelled */
    }
  };

  const retry = () => {
    setErrored(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="flex items-end gap-4">
      {/* Video stage */}
      <div className="flex flex-col">
        <div
          className="relative overflow-hidden rounded-lg bg-black shadow-2xl"
          style={{ height: "min(86dvh, 820px)", aspectRatio: "9 / 16" }}
        >
          <video
            key={retryKey}
            ref={videoRef}
            src={clip.videoUrl}
            loop
            playsInline
            preload="metadata"
            muted={muted}
            onClick={togglePlay}
            onLoadedData={() => setLoaded(true)}
            onError={() => setErrored(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress((v.currentTime / v.duration) * 100);
            }}
            className="h-full w-full object-cover"
          />

          {!loaded && !errored && (
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-card to-secondary" />
          )}

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

          {paused && !errored && (
            <button
              onClick={togglePlay}
              aria-label="Putar"
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <Play className="h-20 w-20 fill-white text-white drop-shadow-lg" />
            </button>
          )}

          {/* Mute + more (top corners) */}
          <button
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Suarakan" : "Bisukan"}
            className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur active:scale-90 cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            aria-label="Lainnya"
            onClick={() => toast("Opsi video")}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur active:scale-90 cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Progress */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div
              className="h-full bg-tikpink transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Caption row below video */}
        <div className="mt-3 max-w-[420px]">
          <Link
            to="/profile/$handle"
            params={{ handle: clip.handle.replace(/^@/, "") }}
            className="text-base font-bold hover:underline"
          >
            {clip.handle}
          </Link>
          <p
            className={cn(
              "mt-1 text-sm leading-snug text-foreground/90",
              !expanded && "line-clamp-2",
            )}
          >
            {clip.caption}{" "}
            {clip.tags.map((t) => (
              <span key={t} className="font-semibold text-tikcyan">
                #{t}{" "}
              </span>
            ))}
          </p>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-0.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {expanded ? "lebih sedikit" : "selengkapnya"}
          </button>
          <div className="mt-2 flex items-center gap-2 text-xs text-foreground/85">
            <Music2 className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{clip.song}</span>
          </div>
        </div>
      </div>

      {/* Action rail OUTSIDE video, like tiktok.com */}
      <div className="flex flex-col items-center gap-4 pb-24">
        <div className="relative">
          <Link
            to="/profile/$handle"
            params={{ handle: clip.handle.replace(/^@/, "") }}
            aria-label={`Profil ${clip.username}`}
          >
            <img
              src={clip.avatar}
              alt={`Avatar ${clip.username}`}
              className="h-12 w-12 rounded-full border border-border object-cover"
            />
          </Link>
          <button
            onClick={handleFollow}
            aria-label={followed ? "Berhenti mengikuti" : "Ikuti"}
            className={cn(
              "absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full text-xs font-bold text-primary-foreground active:scale-90 cursor-pointer",
              followed ? "bg-tikcyan" : "bg-tikpink",
            )}
          >
            {followed ? <Check className="h-3 w-3" /> : "+"}
          </button>
        </div>

        <RailBtn
          onClick={toggleLike}
          ariaLabel="Suka"
          icon={
            <Heart
              className={cn("h-6 w-6", liked ? "fill-tikpink text-tikpink" : "text-foreground")}
            />
          }
          label={formatCount(clip.likes + (liked ? 1 : 0))}
        />
        <RailBtn
          onClick={() => setCommentsOpen(true)}
          ariaLabel="Komentar"
          icon={<MessageCircle className="h-6 w-6 text-foreground" />}
          label={formatCount(clip.comments)}
        />
        <RailBtn
          onClick={handleSave}
          ariaLabel="Simpan"
          icon={
            <Bookmark
              className={cn("h-6 w-6", saved ? "fill-tikcyan text-tikcyan" : "text-foreground")}
            />
          }
          label={formatCount(7273 + (saved ? 1 : 0))}
        />
        <RailBtn
          onClick={handleShare}
          ariaLabel="Bagikan"
          icon={<Share2 className="h-6 w-6 text-foreground" />}
          label={formatCount(shareCount)}
        />

        <button
          onClick={() => toast(`♫ ${clip.song}`, { description: "Gunakan suara ini" })}
          aria-label={`Suara: ${clip.song}`}
          className="mt-2 h-11 w-11 animate-spin-slow overflow-hidden rounded-full border border-border bg-gradient-to-br from-tikpink to-tikcyan p-0.5 active:scale-90 cursor-pointer"
        >
          <img src={clip.avatar} alt="" aria-hidden className="h-full w-full rounded-full object-cover" />
        </button>
      </div>

      <CommentSheet clip={clip} open={commentsOpen} onOpenChange={setCommentsOpen} />
    </div>
  );
}

function RailBtn({
  icon,
  label,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-1 active:scale-90 transition cursor-pointer"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary hover:bg-secondary/70">
        {icon}
      </span>
      <span className="text-xs font-semibold text-foreground/90">{label}</span>
    </button>
  );
}
