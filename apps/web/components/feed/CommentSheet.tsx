import { useEffect, useState } from "react";
import { Heart, Send, X } from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  liked?: boolean;
};

const seedFor = (clipId: string): Comment[] => [
  {
    id: `${clipId}-c1`,
    user: "@dewi.ar",
    avatar: "https://i.pravatar.cc/80?img=15",
    text: "ini sih masuk fyp aku terus 😭🔥",
    time: "2j",
    likes: 1240,
  },
  {
    id: `${clipId}-c2`,
    user: "@bayuu",
    avatar: "https://i.pravatar.cc/80?img=22",
    text: "lagunya apa min? cariin dong",
    time: "1j",
    likes: 312,
  },
  {
    id: `${clipId}-c3`,
    user: "@nara.studio",
    avatar: "https://i.pravatar.cc/80?img=37",
    text: "color gradingnya gokil banget",
    time: "44m",
    likes: 88,
  },
  {
    id: `${clipId}-c4`,
    user: "@kopi.senja",
    avatar: "https://i.pravatar.cc/80?img=8",
    text: "rewatch ke 12 kalinya 🫠",
    time: "10m",
    likes: 19,
  },
];

export function CommentSheet({
  clip,
  open,
  onOpenChange,
}: {
  clip: Clip;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [comments, setComments] = useState<Comment[]>(() => seedFor(clip.id));
  const [text, setText] = useState("");

  useEffect(() => {
    setComments(seedFor(clip.id));
  }, [clip.id]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    setComments((arr) => [
      {
        id: `me-${Date.now()}`,
        user: "@kamu",
        avatar: "https://i.pravatar.cc/80?img=1",
        text: t,
        time: "baru",
        likes: 0,
      },
      ...arr,
    ]);
    setText("");
  };

  const toggleLike = (id: string) =>
    setComments((arr) =>
      arr.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) }
          : c,
      ),
    );

  return (
    <div
      className="absolute inset-0 z-40 flex items-end md:items-stretch md:justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Komentar"
    >
      <button
        aria-label="Tutup"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        className={cn(
          "relative flex w-full flex-col bg-background text-foreground shadow-2xl",
          "h-[75%] rounded-t-2xl md:h-full md:w-[380px] md:rounded-none md:border-l md:border-border",
          "animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 duration-300",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-sm font-semibold">
            {comments.length.toLocaleString("id-ID")} komentar
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Tutup"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <img
                  src={c.avatar}
                  alt=""
                  className="h-9 w-9 flex-none rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">{c.user}</div>
                  <p className="text-sm leading-snug">{c.text}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.time}</span>
                    <button className="hover:text-foreground">Balas</button>
                  </div>
                </div>
                <button
                  onClick={() => toggleLike(c.id)}
                  aria-label="Suka komentar"
                  aria-pressed={c.liked}
                  className="flex flex-col items-center gap-0.5 text-muted-foreground"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      c.liked ? "fill-tikpink text-tikpink" : "",
                    )}
                  />
                  <span className="text-[10px]">{c.likes}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 border-t border-border bg-background p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Komentar sebagai @kamu ke ${clip.handle}...`}
            className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-tikcyan"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Kirim"
            className="grid h-9 w-9 place-items-center rounded-full bg-tikpink text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
