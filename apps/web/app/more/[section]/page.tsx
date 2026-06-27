"use client";

import { useParams } from "next/navigation";
import { PageShell } from "@/components/feed/PageShell";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, type ReactElement } from "react";
import { toast } from "sonner";

type SectionDef = {
  title: string;
  subtitle: string;
  render: () => ReactElement;
};

const SECTIONS: Record<string, SectionDef> = {
  pengaturan: {
    title: "Pengaturan",
    subtitle: "Kelola preferensi akun kamu",
    render: () => <SettingsPanel />,
  },
  privasi: {
    title: "Privasi",
    subtitle: "Atur siapa yang bisa melihat aktivitasmu",
    render: () => <PrivacyPanel />,
  },
  bahasa: {
    title: "Bahasa",
    subtitle: "Pilih bahasa yang digunakan aplikasi",
    render: () => <LanguagePanel />,
  },
  tampilan: {
    title: "Tampilan",
    subtitle: "Sesuaikan tema antarmuka",
    render: () => <AppearancePanel />,
  },
  bantuan: {
    title: "Bantuan",
    subtitle: "Pertanyaan umum dan dukungan",
    render: () => <HelpPanel />,
  },
  ketentuan: {
    title: "Ketentuan & Kebijakan",
    subtitle: "Syarat layanan dan kebijakan privasi",
    render: () => <TermsPanel />,
  },
};

export default function SectionPage() {
  const params = useParams();
  const section = params.section as string;
  const def = SECTIONS[section];

  if (!def) {
    return (
      <PageShell title="Tidak ditemukan" subtitle="Halaman tidak tersedia">
        <div className="py-8 text-center text-muted-foreground">
          Section &quot;{section}&quot; tidak ditemukan.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={def.title} subtitle={def.subtitle}>
      <div className="mx-auto max-w-2xl">{def.render()}</div>
    </PageShell>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border divide-y divide-border">
      {children}
    </div>
  );
}

function SettingsPanel() {
  const [notif, setNotif] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [data, setData] = useState(false);
  return (
    <Card>
      <Row label="Notifikasi push" description="Terima pemberitahuan dari Klip">
        <Switch checked={notif} onCheckedChange={setNotif} />
      </Row>
      <Row label="Putar otomatis" description="Mainkan klip secara otomatis di feed">
        <Switch checked={autoplay} onCheckedChange={setAutoplay} />
      </Row>
      <Row label="Hemat data" description="Kurangi penggunaan kuota saat menonton">
        <Switch checked={data} onCheckedChange={setData} />
      </Row>
    </Card>
  );
}

function PrivacyPanel() {
  const [priv, setPriv] = useState(false);
  const [dm, setDm] = useState(true);
  const [seen, setSeen] = useState(true);
  return (
    <Card>
      <Row label="Akun pribadi" description="Hanya pengikut yang dapat melihat klipmu">
        <Switch checked={priv} onCheckedChange={setPriv} />
      </Row>
      <Row label="Izinkan pesan langsung" description="Siapa pun boleh mengirim pesan">
        <Switch checked={dm} onCheckedChange={setDm} />
      </Row>
      <Row label="Tampilkan status dilihat" description="Pengirim tahu kamu sudah membaca">
        <Switch checked={seen} onCheckedChange={setSeen} />
      </Row>
    </Card>
  );
}

function LanguagePanel() {
  const [lang, setLang] = useState("id");
  const options = [
    { id: "id", label: "Bahasa Indonesia" },
    { id: "en", label: "English" },
    { id: "ms", label: "Bahasa Melayu" },
    { id: "ja", label: "日本語" },
  ];
  return (
    <Card>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => {
            setLang(o.id);
            toast(`Bahasa diatur ke ${o.label}`);
          }}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-secondary/50"
        >
          <span className="text-sm font-medium">{o.label}</span>
          <span
            className={`h-4 w-4 rounded-full border ${
              lang === o.id ? "border-tikpink bg-tikpink" : "border-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </Card>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState("dark");
  const options = [
    { id: "dark", label: "Gelap" },
    { id: "light", label: "Terang" },
    { id: "system", label: "Ikuti sistem" },
  ];
  return (
    <Card>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => {
            setTheme(o.id);
            toast(`Tema: ${o.label}`);
          }}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-secondary/50"
        >
          <span className="text-sm font-medium">{o.label}</span>
          <span
            className={`h-4 w-4 rounded-full border ${
              theme === o.id ? "border-tikpink bg-tikpink" : "border-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </Card>
  );
}

function HelpPanel() {
  const faqs = [
    {
      q: "Bagaimana cara mengunggah klip?",
      a: "Tekan menu Unggah, pilih video, tulis takarir, lalu tekan Unggah.",
    },
    {
      q: "Bagaimana cara mengubah kata sandi?",
      a: "Buka Pengaturan akun, pilih Keamanan, lalu Ubah kata sandi.",
    },
    {
      q: "Mengapa klipku tidak muncul di Untukmu?",
      a: "Klip baru memerlukan waktu agar sistem rekomendasi memprosesnya.",
    },
  ];
  return (
    <div className="space-y-3">
      <Card>
        {faqs.map((f) => (
          <div key={f.q} className="px-4 py-3.5">
            <div className="text-sm font-semibold">{f.q}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.a}</div>
          </div>
        ))}
      </Card>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => toast("Tim dukungan akan menghubungi kamu via email")}
      >
        Hubungi dukungan
      </Button>
    </div>
  );
}

function TermsPanel() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h2 className="mb-1 text-base font-semibold text-foreground">Ketentuan Layanan</h2>
        <p>
          Dengan menggunakan Klip kamu menyetujui aturan komunitas, larangan
          unggahan ilegal, dan kebijakan hak cipta yang berlaku.
        </p>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-foreground">Kebijakan Privasi</h2>
        <p>
          Kami mengumpulkan data minimum yang diperlukan untuk menjalankan
          layanan, tidak menjual data ke pihak ketiga, dan kamu dapat menghapus
          akun kapan saja.
        </p>
      </section>
      <section>
        <h2 className="mb-1 text-base font-semibold text-foreground">Kebijakan Konten</h2>
        <p>
          Konten yang melanggar aturan komunitas akan dihapus tanpa
          pemberitahuan. Pelanggaran berulang dapat berakibat penangguhan akun.
        </p>
      </section>
    </div>
  );
}
