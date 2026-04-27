import { useState } from "react";
import { Character } from "@/pages/Index";
import Icon from "@/components/ui/icon";

type Props = {
  onCreate: (char: Character) => void;
  onCancel: () => void;
};

const COLOR_OPTIONS = [
  { label: "Фиолетовый", value: "#a855f7" },
  { label: "Голубой", value: "#22d3ee" },
  { label: "Золотой", value: "#f59e0b" },
  { label: "Розовый", value: "#fb7185" },
  { label: "Зелёный", value: "#4ade80" },
  { label: "Оранжевый", value: "#fb923c" },
];

const TAG_OPTIONS = [
  "Мудрость", "Юмор", "Философия", "Наука", "Творчество",
  "Поддержка", "Мистика", "История", "Технологии", "Природа",
  "Поэзия", "Психология",
];

const PERSONALITY_OPTIONS = [
  "Загадочный", "Весёлый", "Серьёзный", "Заботливый", "Саркастичный",
  "Мудрый", "Энергичный", "Спокойный", "Дерзкий", "Романтичный",
];

const AVATAR_OPTIONS = [
  "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/50d553df-abcf-4ef2-8b97-854c18dc1b73.jpg",
  "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/c143e209-c28d-4e76-8124-3fbf78924588.jpg",
  "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/900ca396-7dde-4b61-84e8-5dd7737af1ea.jpg",
  "https://cdn.poehali.dev/projects/c4ccce35-7804-45ce-b322-fe616531d1f5/files/2bd3cff3-6775-472d-99b6-d8b2e95a9385.jpg",
];

export default function CreateCharacter({ onCreate, onCancel }: Props) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [stats, setStats] = useState({ intellect: 70, mystique: 50, empathy: 70 });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const togglePersonality = (p: string) => {
    setSelectedPersonality((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length < 3 ? [...prev, p] : prev
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const newChar: Character = {
      id: Date.now().toString(),
      name: name.trim(),
      title: title.trim() || "Мой персонаж",
      description: description.trim() || "Уникальный ИИ-собеседник с особым характером.",
      avatar: selectedAvatar,
      tags: selectedTags.length > 0 ? selectedTags : ["Уникальный"],
      color: selectedColor,
      glowClass: "glow-purple",
      stats: [
        { label: "Интеллект", value: stats.intellect },
        { label: "Мистика", value: stats.mystique },
        { label: "Эмпатия", value: stats.empathy },
      ],
      personality: selectedPersonality.length > 0 ? selectedPersonality : ["Особенный"],
      isCustom: true,
    };
    onCreate(newChar);
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <Icon name="ArrowLeft" size={16} className="group-hover:-translate-x-1 transition-transform" />
        Назад
      </button>

      <div
        className="opacity-0 animate-fade-up mb-10"
        style={{ animationFillMode: "forwards" }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border"
          style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "#c084fc" }}
        >
          ✦ Создание персонажа
        </div>
        <h1 className="font-display text-5xl text-white font-light mb-2">
          Воплоти свою идею
        </h1>
        <p className="text-muted-foreground">Создай уникального собеседника с особым характером</p>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        {/* Form */}
        <div
          className="space-y-7 opacity-0 animate-fade-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          {/* Name & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Имя *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Назови персонажа"
                className="w-full px-4 py-3 rounded-xl text-white placeholder:text-muted-foreground/50 outline-none transition-all focus:ring-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  focusRingColor: selectedColor,
                }}
                onFocus={(e) => (e.target.style.borderColor = selectedColor + "60")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Звание
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Страж, Оракул..."
                className="w-full px-4 py-3 rounded-xl text-white placeholder:text-muted-foreground/50 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.target.style.borderColor = selectedColor + "60")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажи о характере и особенностях этого персонажа..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-white placeholder:text-muted-foreground/50 outline-none transition-all resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => (e.target.style.borderColor = selectedColor + "60")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Цвет персонажа
            </label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className="w-9 h-9 rounded-full transition-all hover:scale-110"
                  style={{
                    background: c.value,
                    boxShadow: selectedColor === c.value ? `0 0 0 3px rgba(255,255,255,0.2), 0 0 12px ${c.value}` : "none",
                    transform: selectedColor === c.value ? "scale(1.2)" : "scale(1)",
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Теги (до 3-х)
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      background: selected ? `${selectedColor}25` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${selected ? selectedColor + "50" : "rgba(255,255,255,0.1)"}`,
                      color: selected ? selectedColor : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Личность (до 3-х)
            </label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_OPTIONS.map((p) => {
                const selected = selectedPersonality.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePersonality(p)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      background: selected ? `${selectedColor}25` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${selected ? selectedColor + "50" : "rgba(255,255,255,0.1)"}`,
                      color: selected ? selectedColor : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Характеристики
            </label>
            <div className="space-y-5">
              {([
                { key: "intellect", label: "Интеллект" },
                { key: "mystique", label: "Мистика" },
                { key: "empathy", label: "Эмпатия" },
              ] as const).map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/80">{label}</span>
                    <span style={{ color: selectedColor }}>{stats[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stats[key]}
                    onChange={(e) =>
                      setStats((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                    }
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, ${selectedColor} ${stats[key]}%, rgba(255,255,255,0.1) ${stats[key]}%)`,
                      accentColor: selectedColor,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div
          className="opacity-0 animate-fade-up delay-400"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="sticky top-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Внешность
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className="relative rounded-xl overflow-hidden aspect-square transition-all"
                  style={{
                    boxShadow: selectedAvatar === av ? `0 0 0 2px ${selectedColor}, 0 0 20px ${selectedColor}40` : "none",
                    transform: selectedAvatar === av ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <img src={av} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Live preview card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                border: `1px solid ${selectedColor}30`,
                boxShadow: `0 0 30px ${selectedColor}15`,
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={selectedAvatar} alt="preview" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,10,20,0.9) 0%, transparent 60%)" }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${selectedColor}, transparent)` }}
                />
              </div>
              <div className="p-4">
                <div className="text-xs mb-1" style={{ color: selectedColor }}>
                  {title || "Звание персонажа"}
                </div>
                <div className="font-display text-xl text-white">
                  {name || "Имя персонажа"}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="mt-5 w-full py-3.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: isValid
                  ? `linear-gradient(135deg, ${selectedColor}, ${selectedColor}90)`
                  : "rgba(255,255,255,0.1)",
                color: isValid ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              Создать персонажа
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
