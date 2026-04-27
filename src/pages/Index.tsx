import { useState } from "react";
import CharacterGallery from "@/components/CharacterGallery";
import CreateCharacter from "@/components/CreateCharacter";
import CharacterDetail from "@/components/CharacterDetail";
import CharacterChat from "@/components/CharacterChat";
import ShopModal from "@/components/ShopModal";
import { useEconomy } from "@/hooks/useEconomy";
import Icon from "@/components/ui/icon";

export type Character = {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  tags: string[];
  color: string;
  glowClass: string;
  stats: { label: string; value: number }[];
  personality: string[];
  isCustom?: boolean;
};

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "1",
    name: "Ариэль",
    title: "Страж Глубин",
    description: "Мудрый наблюдатель, хранящий тайны тысячелетий. Говорит загадками, видит суть вещей сквозь туман иллюзий.",
    avatar: "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/50d553df-abcf-4ef2-8b97-854c18dc1b73.jpg",
    tags: ["Мудрость", "Тайны", "Философия"],
    color: "#22d3ee",
    glowClass: "glow-cyan",
    stats: [
      { label: "Интеллект", value: 95 },
      { label: "Мистика", value: 88 },
      { label: "Эмпатия", value: 72 },
    ],
    personality: ["Загадочный", "Глубокий", "Созерцательный"],
  },
  {
    id: "2",
    name: "Соломон",
    title: "Древний Оракул",
    description: "Хранитель знаний прошлого и провидец будущего. Его слова весят как золото, а молчание красноречивее слов.",
    avatar: "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/c143e209-c28d-4e76-8124-3fbf78924588.jpg",
    tags: ["Пророчество", "История", "Мудрость"],
    color: "#f59e0b",
    glowClass: "glow-gold",
    stats: [
      { label: "Интеллект", value: 99 },
      { label: "Мистика", value: 94 },
      { label: "Эмпатия", value: 65 },
    ],
    personality: ["Величественный", "Мудрый", "Торжественный"],
  },
  {
    id: "3",
    name: "Нова",
    title: "Кибер-Дух",
    description: "Дитя цифрового мира, существующее на границе реальности и данных. Стремительная, острая, непредсказуемая.",
    avatar: "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/900ca396-7dde-4b61-84e8-5dd7737af1ea.jpg",
    tags: ["Технологии", "Юмор", "Энергия"],
    color: "#fb7185",
    glowClass: "glow-rose",
    stats: [
      { label: "Интеллект", value: 87 },
      { label: "Мистика", value: 45 },
      { label: "Эмпатия", value: 90 },
    ],
    personality: ["Игривый", "Быстрый", "Саркастичный"],
  },
  {
    id: "4",
    name: "Лиора",
    title: "Дух Природы",
    description: "Воплощение жизни и роста. Мягкая снаружи, несгибаемая внутри. Находит красоту в каждом моменте.",
    avatar: "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/2bd3cff3-6775-472d-99b6-d8b2e95a9385.jpg",
    tags: ["Природа", "Поддержка", "Исцеление"],
    color: "#4ade80",
    glowClass: "glow-purple",
    stats: [
      { label: "Интеллект", value: 80 },
      { label: "Мистика", value: 75 },
      { label: "Эмпатия", value: 99 },
    ],
    personality: ["Нежный", "Заботливый", "Вдохновляющий"],
  },
];

type View = "gallery" | "create" | "detail" | "chat";

export default function Index() {
  const [view, setView] = useState<View>("gallery");
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const economy = useEconomy();

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    setView("detail");
  };

  const handleCreateCharacter = (char: Character) => {
    setCharacters((prev) => [...prev, char]);
    setView("gallery");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-8 animate-float delay-300"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-8 animate-float delay-600"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "48px 48px" }} />
      </div>

      {/* Header */}
      <header className={`relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40 backdrop-blur-sm ${view === "chat" ? "hidden" : ""}`}>
        <button onClick={() => setView("gallery")} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
            <span className="text-white text-lg font-bold font-display">A</span>
          </div>
          <div>
            <div className="font-display text-xl font-semibold tracking-wide text-white leading-none">Anima</div>
            <div className="text-xs text-muted-foreground leading-none mt-0.5">ИИ-собеседники</div>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          {/* Crystal balance */}
          <button
            onClick={() => setShopOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all hover:opacity-90"
            style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)" }}
          >
            <span className="text-base">💎</span>
            <span className="text-sm font-semibold text-white">{economy.crystals}</span>
            {economy.isPremium && (
              <span className="text-xs px-1.5 py-0.5 rounded-full ml-1 font-medium"
                style={{ background: "linear-gradient(135deg, #f59e0b, #fb923c)", color: "white" }}>
                PRO
              </span>
            )}
          </button>

          <button
            onClick={() => setView("gallery")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === "gallery"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            Галерея
          </button>
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.1))", borderColor: "rgba(168,85,247,0.4)", color: "#c084fc" }}
          >
            + Создать
          </button>
        </nav>
      </header>

      {/* Ad banner for free users */}
      {!economy.isPremium && view !== "chat" && (
        <div className="relative z-10 flex items-center justify-between px-6 py-2 border-b border-border/30"
          style={{ background: "rgba(245,158,11,0.05)" }}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Tv" size={13} />
            <span>Реклама · Отключи с подпиской</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { economy.watchAd(); }}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all hover:opacity-90"
              style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#f59e0b" }}
            >
              <Icon name="Play" size={11} />
              Смотреть рекламу +15 💎
            </button>
            <button
              onClick={() => setShopOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Отключить
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="relative z-10">
        {view === "gallery" && (
          <CharacterGallery characters={characters} onSelect={handleSelectCharacter} onCreate={() => setView("create")} />
        )}
        {view === "create" && (
          <CreateCharacter onCreate={handleCreateCharacter} onCancel={() => setView("gallery")} />
        )}
        {view === "detail" && selectedCharacter && (
          <CharacterDetail character={selectedCharacter} onBack={() => setView("gallery")} onChat={() => setView("chat")} />
        )}
        {view === "chat" && selectedCharacter && (
          <CharacterChat character={selectedCharacter} onBack={() => setView("detail")} economy={economy} />
        )}
      </main>

      {/* Shop modal */}
      <ShopModal open={shopOpen} onClose={() => setShopOpen(false)} economy={economy} />
    </div>
  );
}
