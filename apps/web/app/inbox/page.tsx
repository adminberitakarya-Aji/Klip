"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { ArrowLeft, Send, Search, Smile, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { SideNav } from "@/components/feed/SideNav";
import { clips } from "@/data/feed";
import { cn } from "@/lib/utils";

type Msg = { id: string; from: "me" | "them"; text: string; at: number };

const now = Date.now();
const m = (n: number) => now - n * 60_000;

function seedThread(handle: string): Msg[] {
  const h = handle.charCodeAt(1) || 1;
  const seeds: Msg[][] = [
    [
      { id: "1", from: "them", text: "haii! suka banget video terakhirmu 🌆", at: m(180) },
      { id: "2", from: "me", text: "makasih banyak! kamu kreator juga?", at: m(178) },
      { id: "3", from: "them", text: "iyaa, baru mulai sih. ada tips gak buat lighting senja?", at: m(170) },
      { id: "4", from: "me", text: "pakai golden hour 30 menit sebelum matahari terbenam, trust me 🌅", at: m(165) },
      { id: "5", from: "them", text: "noted! bakal cobain weekend ini ✨", at: m(12) },
    ],
    [
      { id: "1", from: "me", text: "bro tarian barunya viral banget 😂", at: m(420) },
      { id: "2", from: "them", text: "wkwkwk gak nyangka sih, padahal asal aja", at: m(415) },
      { id: "3", from: "them", text: "duet yuk?", at: m(60) },
    ],
    [
      { id: "1", from: "them", text: "resep ramennya beneran 3 menit kak?", at: m(240) },
      { id: "2", from: "me", text: "beneran! kuncinya kaldu instan + telur setengah matang", at: m(238) },
      { id: "3", from: "them", text: "fix cobain malam ini 🍜", at: m(5) },
    ],
  ];
  return seeds[h % seeds.length];
}

const conversations = clips.map((c, i) => {
  const handle = c.handle.replace(/^@/, "");
  const thread = seedThread(handle);
  const last = thread[thread.length - 1];
  return {
    handle,
    username: c.username,
    avatar: c.avatar,
    lastMessage: last.text,
    lastAt: last.at,
    unread: i % 3 === 0 ? (i % 2) + 1 : 0,
    online: i % 2 === 0,
  };
});

function relativeTime(t: number) {
  const diff = Math.max(0, Date.now() - t);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j`;
  return `${Math.floor(hrs / 24)}h`;
}

function InboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chat = searchParams.get("chat");
  const activeHandle = chat ?? conversations[0]?.handle;
  const active = conversations.find((c) => c.handle === activeHandle);

  const [threads, setThreads] = useState<Record<string, Msg[]>>(() =>
    Object.fromEntries(conversations.map((c) => [c.handle, seedThread(c.handle)])),
  );
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      conversations.filter(
        (c) =>
          c.username.toLowerCase().includes(query.toLowerCase()) ||
          c.handle.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setThreads((t) => ({
      ...t,
      [active.handle]: [
        ...(t[active.handle] ?? []),
        { id: String(Date.now()), from: "me", text, at: Date.now() },
      ],
    }));
    setDraft("");
    setTimeout(() => {
      setThreads((t) => ({
        ...t,
        [active.handle]: [
          ...(t[active.handle] ?? []),
          {
            id: String(Date.now() + 1),
            from: "them",
            text: "oke noted! 👌",
            at: Date.now(),
          },
        ],
      }));
    }, 1200);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <SideNav />

      <main className="flex min-w-0 flex-1">
        {/* Conversation list */}
        <section
          className={cn(
            "flex w-full flex-col border-r border-border md:w-80 lg:w-96",
            active && "hidden md:flex",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <h1 className="text-xl font-bold">Pesan</h1>
            <button
              aria-label="Lainnya"
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3 pt-3">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto py-2">
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                Tidak ada percakapan.
              </li>
            )}
            {filtered.map((c) => {
              const isActive = c.handle === activeHandle;
              const last = threads[c.handle]?.[threads[c.handle].length - 1];
              return (
                <li key={c.handle}>
                  <button
                    onClick={() => router.push(`/inbox?chat=${c.handle}`, { scroll: false })}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
                      isActive ? "bg-secondary" : "hover:bg-secondary/60",
                    )}
                  >
                    <div className="relative shrink-0">
                      <Image
                        src={c.avatar}
                        alt={c.username}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {c.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-tikcyan" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold">{c.username}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {relativeTime(last?.at ?? c.lastAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            c.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {last?.from === "me" ? "Kamu: " : ""}
                          {last?.text ?? c.lastMessage}
                        </span>
                        {c.unread > 0 && (
                          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-tikpink px-1.5 text-[11px] font-bold text-primary-foreground">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Chat panel */}
        <section className={cn("flex min-w-0 flex-1 flex-col", !active && "hidden md:flex")}>
          {active ? (
            <ChatView
              key={active.handle}
              conv={active}
              messages={threads[active.handle] ?? []}
              draft={draft}
              onDraftChange={setDraft}
              onSend={send}
              onBack={() => router.push("/inbox", { scroll: false })}
            />
          ) : (
            <div className="grid flex-1 place-items-center text-center">
              <div className="max-w-xs">
                <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-secondary">
                  <Send className="h-7 w-7 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-bold">Pesanmu</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih percakapan untuk mulai membalas.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <InboxContent />
    </Suspense>
  );
}

function ChatView({
  conv,
  messages,
  draft,
  onDraftChange,
  onSend,
  onBack,
}: {
  conv: (typeof conversations)[number];
  messages: Msg[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <>
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-3 py-3 md:px-5">
        <button
          onClick={onBack}
          aria-label="Kembali"
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link
          href={`/profile/${conv.handle}`}
          className="flex min-w-0 items-center gap-3"
        >
          <Image
            src={conv.avatar}
            alt={conv.username}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0">
            <div className="truncate font-semibold">{conv.username}</div>
            <div className="text-xs text-muted-foreground">
              {conv.online ? "Sedang aktif" : "Aktif baru-baru ini"}
            </div>
          </div>
        </Link>
        <div className="flex-1" />
        <button
          aria-label="Lainnya"
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 md:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          {messages.map((msg, i) => {
            const prev = messages[i - 1];
            const showTime = !prev || msg.at - prev.at > 5 * 60_000;
            const mine = msg.from === "me";
            return (
              <div key={msg.id} className="flex flex-col">
                {showTime && (
                  <div className="my-2 text-center text-[11px] text-muted-foreground">
                    {new Date(msg.at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
                <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-snug",
                      mine
                        ? "rounded-br-md bg-tikpink text-primary-foreground"
                        : "rounded-bl-md bg-secondary text-foreground",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="border-t border-border px-3 py-3 md:px-6"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
          <button
            type="button"
            aria-label="Emoji"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-background/40"
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            aria-label="Lampirkan gambar"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-background/40"
          >
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </button>
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={`Kirim pesan ke ${conv.username}`}
            className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Kirim"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition",
              draft.trim()
                ? "bg-tikpink text-primary-foreground hover:opacity-90"
                : "bg-transparent text-muted-foreground",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </>
  );
}
