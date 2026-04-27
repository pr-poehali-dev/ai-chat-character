import { Character } from "@/pages/Index";
import Icon from "@/components/ui/icon";

type Props = {
  characters: Character[];
  onSelect: (char: Character) => void;
  onCreate: () => void;
};

export default function CharacterGallery({ characters, onSelect, onCreate }: Props) {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
          style={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "#c084fc" }}>
          ✦ {characters.length} персонажей доступно
        </div>
        <h1 className="font-display text-6xl md:text-7xl font-light text-white mb-4 leading-none">
          Выбери своего{" "}
          <span className="italic" style={{ color: "#a855f7", textShadow: "0 0 40px rgba(168,85,247,0.5)" }}>
            собеседника
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Каждый персонаж уникален — со своей историей, характером и способом видеть мир
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {characters.map((char, i) => (
          <CharacterCard
            key={char.id}
            character={char}
            onSelect={onSelect}
            delay={i * 100}
          />
        ))}

        {/* Create card */}
        <button
          onClick={onCreate}
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 min-h-[380px] transition-all hover:border-primary/60 hover:bg-white/5 group opacity-0 animate-fade-up"
          style={{
            borderColor: "rgba(168,85,247,0.25)",
            animationDelay: `${characters.length * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}
          >
            <Icon name="Plus" size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <div className="font-display text-xl text-white mb-1">Создать персонажа</div>
            <div className="text-sm text-muted-foreground">Воплоти свою идею</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function CharacterCard({
  character,
  onSelect,
  delay,
}: {
  character: Character;
  onSelect: (c: Character) => void;
  delay: number;
}) {
  return (
    <button
      onClick={() => onSelect(character)}
      className="group relative rounded-2xl overflow-hidden text-left card-hover cursor-pointer opacity-0 animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
        background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, hsl(var(--card)) 0%, transparent 60%)`,
          }}
        />
        {/* Custom badge */}
        {character.isCustom && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(168,85,247,0.8)", color: "white" }}
          >
            Мой
          </div>
        )}
        {/* Color accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-80 transition-opacity group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${character.color}, transparent)` }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <div className="text-xs font-medium mb-1" style={{ color: character.color }}>
            {character.title}
          </div>
          <div className="font-display text-2xl text-white font-medium leading-tight">
            {character.name}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {character.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {character.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: `${character.color}18`,
                color: character.color,
                border: `1px solid ${character.color}35`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ color: character.color }}
        >
          Начать общение
          <Icon name="ArrowRight" size={14} />
        </div>
      </div>
    </button>
  );
}
