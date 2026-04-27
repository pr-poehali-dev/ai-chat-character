import { Character } from "@/pages/Index";
import Icon from "@/components/ui/icon";

type Props = {
  character: Character;
  onBack: () => void;
  onChat: () => void;
};

export default function CharacterDetail({ character, onBack, onChat }: Props) {
  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <Icon name="ArrowLeft" size={16} className="group-hover:-translate-x-1 transition-transform" />
        Все персонажи
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left — Image */}
        <div
          className="relative rounded-3xl overflow-hidden opacity-0 animate-fade-up"
          style={{ animationFillMode: "forwards" }}
        >
          <img
            src={character.avatar}
            alt={character.name}
            className="w-full aspect-square object-cover"
          />
          {/* Glow border */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 1px ${character.color}40, 0 0 60px ${character.color}25`,
            }}
          />
          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3"
            style={{ background: `linear-gradient(to top, ${character.color}30, transparent)` }}
          />

          {/* Personality chips */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            {character.personality.map((p) => (
              <span
                key={p}
                className="text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${character.color}50`,
                  color: character.color,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Info */}
        <div
          className="opacity-0 animate-fade-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="text-sm font-medium mb-2" style={{ color: character.color }}>
            {character.title}
          </div>
          <h1 className="font-display text-5xl text-white font-light mb-4 leading-none">
            {character.name}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 text-base">
            {character.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: `${character.color}15`,
                  border: `1px solid ${character.color}30`,
                  color: character.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-4 mb-10">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Характеристики
            </div>
            {character.stats.map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground/80">{stat.label}</span>
                  <span className="font-medium" style={{ color: character.color }}>
                    {stat.value}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${stat.value}%`,
                      background: `linear-gradient(90deg, ${character.color}80, ${character.color})`,
                      boxShadow: `0 0 8px ${character.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onChat}
            className="w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${character.color}, ${character.color}cc)`,
              color: "white",
              boxShadow: `0 0 30px ${character.color}40`,
            }}
          >
            <Icon name="MessageCircle" size={18} />
            Начать разговор с {character.name}
          </button>

          <p className="text-center text-xs text-muted-foreground mt-3">
            ИИ-персонаж готов к общению прямо сейчас
          </p>
        </div>
      </div>
    </div>
  );
}