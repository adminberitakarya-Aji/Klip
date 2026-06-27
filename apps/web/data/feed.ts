export type Clip = {
  id: string;
  videoUrl: string;
  username: string;
  handle: string;
  avatar: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number; // ✅ ADDED: untuk label count di tombol Bookmark
  tags: string[];
};

// Public sample videos (Google sample-videos CDN)
const V = (name: string) =>
  `https://storage.googleapis.com/gtv-videos-bucket/sample/${name}.mp4`;

export const clips: Clip[] = [
  {
    id: "1",
    videoUrl: V("BigBuckBunny"),
    username: "Luna Park",
    handle: "@lunapark",
    avatar: "https://i.pravatar.cc/120?img=47",
    caption: "saat senja menelan kota — pov: kamu jatuh cinta lagi 🌆",
    song: "midnight drive · synthwave",
    likes: 128400,
    comments: 2310,
    shares: 884,
    saves: 7300, // ✅ ADDED
    tags: ["sunset", "aesthetic", "fyp"],
  },
  {
    id: "2",
    videoUrl: V("ElephantsDream"),
    username: "Rio Hadid",
    handle: "@rio.h",
    avatar: "https://i.pravatar.cc/120?img=12",
    caption: "ngajarin temenku tarian baru, hasilnya... lihat sendiri 😂",
    song: "say so (sped up)",
    likes: 89200,
    comments: 4120,
    shares: 1290,
    saves: 5100, // ✅ ADDED
    tags: ["dance", "fail", "viral"],
  },
  {
    id: "3",
    videoUrl: V("ForBiggerBlazes"),
    username: "Sasha K.",
    handle: "@sashakitchen",
    avatar: "https://i.pravatar.cc/120?img=32",
    caption: "resep ramen 3 menit yang ngalahin restoran. trust me.",
    song: "kitchen lofi · cozy beats",
    likes: 412800,
    comments: 9821,
    shares: 5400,
    saves: 24600, // ✅ ADDED
    tags: ["food", "ramen", "recipe"],
  },
  {
    id: "4",
    videoUrl: V("ForBiggerEscapes"),
    username: "Ari W.",
    handle: "@arijalan",
    avatar: "https://i.pravatar.cc/120?img=68",
    caption: "menyetir tanpa tujuan, ketemu pantai yang gak ada di google maps.",
    song: "blinding lights",
    likes: 73100,
    comments: 980,
    shares: 410,
    saves: 3200, // ✅ ADDED
    tags: ["roadtrip", "travel"],
  },
  {
    id: "5",
    videoUrl: V("ForBiggerFun"),
    username: "Mika Studio",
    handle: "@mikastudio",
    avatar: "https://i.pravatar.cc/120?img=5",
    caption: "behind the scenes shoot kemarin. semua di-handle sendiri 🎬",
    song: "original audio · mika",
    likes: 22000,
    comments: 312,
    shares: 88,
    saves: 940, // ✅ ADDED
    tags: ["bts", "film", "indie"],
  },
];
