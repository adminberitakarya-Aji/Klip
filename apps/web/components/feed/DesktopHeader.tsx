import { Search, Upload, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DesktopHeader() {
  return (
    <header className="hidden md:flex sticky top-0 z-20 h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex-1" />
      <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-secondary px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Cari kreator, lagu, atau tag"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:bg-secondary">
          <Upload className="h-4 w-4" /> Unggah
        </button>
        <Link to="/inbox" aria-label="Pesan" className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary">
          <MessageCircle className="h-5 w-5" />
        </Link>
        <button className="rounded-md bg-tikpink px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Masuk
        </button>
      </div>
    </header>
  );
}
