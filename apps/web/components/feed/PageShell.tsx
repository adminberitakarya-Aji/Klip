import { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { SideNav } from "@/components/feed/SideNav";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function PageShell({ title, subtitle, children }: Props) {
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) router.history.back();
    else router.navigate({ to: "/" });
  };
  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground">
      <SideNav />
      <div className="flex min-h-[100dvh] flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-3 py-3 backdrop-blur md:hidden">
          <button
            onClick={handleBack}
            aria-label="Kembali"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="truncate text-base font-semibold">{title}</h1>
          <Link to="/" className="text-xs text-muted-foreground">Beranda</Link>
        </header>
        {/* Desktop header */}
        <header className="hidden border-b border-border px-6 py-5 md:block">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </header>
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}
