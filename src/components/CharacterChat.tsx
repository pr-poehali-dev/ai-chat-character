import { useState, useRef, useEffect } from "react";
import { Character } from "@/pages/Index";
import Icon from "@/components/ui/icon";

type Message = {
  id: string;
  role: "user" | "character";
  text: string;
  ts: number;
};

type Props = {
  character: Character;
  onBack: () => void;
};

const STARTERS: Record<string, string[]> = {
  "1": [
    "Скажи мне, путник — что ты ищешь в глубинах своей души?",
    "Тишина говорит больше слов. Что привело тебя ко мне?",
  ],
  "2": [
    "Я видел тысячи судеб. Твоя — особенная. Спрашивай.",
    "Прошлое и будущее переплетены. Что тебя тревожит?",
  ],
  "3": [
    "Привет! Готова к абсолютно любому безумию. Что взорвём сегодня? 😈",
    "О, новый собеседник! Так, с чего начнём — с философии или мемов?",
  ],
  "4": [
    "Добро пожаловать. Я чувствую, тебе есть что сказать. Я здесь.",
    "Каждая встреча — это маленькое чудо. Расскажи мне о себе.",
  ],
};

function getStarter(character: Character): string {
  const pool = STARTERS[character.id] ?? [
    `Привет! Я ${character.name}. Чем могу помочь?`,
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function simulateReply(character: Character, userMsg: string): Promise<string> {
  const replies = [
    `Интересная мысль. Если смотреть глубже — ${userMsg.split(" ").slice(0, 3).join(" ")}... это лишь поверхность.`,
    `Ты затронул нечто важное. Позволь мне поразмышлять над этим вместе с тобой.`,
    `Хм. Знаешь, в этом есть своя истина. Что ты чувствуешь, когда думаешь об этом?`,
    `Не каждый решается задать такой вопрос. Уважаю. Вот мой взгляд: мир многограннее, чем кажется.`,
    `Это напоминает мне одну историю... Но сначала — что для тебя значит то, о чём ты говоришь?`,
    `Да. И нет. Всё зависит от угла зрения. Давай исследуем это вместе.`,
  ];
  const delay = 800 + Math.random() * 1200;
  return new Promise((res) =>
    setTimeout(() => res(replies[Math.floor(Math.random() * replies.length)]), delay)
  );
}

export default function CharacterChat({ character, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "character",
      text: getStarter(character),
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const reply = await simulateReply(character, text);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "character", text: reply, ts: Date.now() },
    ]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Chat header */}
      <div
        className="flex items-center gap-4 px-6 py-4 border-b border-border/40 backdrop-blur-sm"
        style={{ background: "rgba(10,10,20,0.6)" }}
      >
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Icon name="ArrowLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative">
          <img
            src={character.avatar}
            alt={character.name}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: `2px solid ${character.color}60` }}
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background animate-pulse-glow"
            style={{ background: character.color }}
          />
        </div>

        <div>
          <div className="font-display text-lg text-white leading-none">{character.name}</div>
          <div className="text-xs mt-0.5" style={{ color: character.color }}>
            {character.title} · онлайн
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          {character.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full hidden sm:inline-block"
              style={{
                background: `${character.color}15`,
                border: `1px solid ${character.color}30`,
                color: character.color,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex gap-3 opacity-0 animate-fade-up`}
              style={{
                animationDelay: `${Math.min(i * 40, 200)}ms`,
                animationFillMode: "forwards",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "character" && (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                  style={{ border: `1px solid ${character.color}50` }}
                />
              )}
              <div
                className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "character"
                    ? {
                        background: `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))`,
                        border: `1px solid ${character.color}25`,
                        color: "hsl(var(--foreground))",
                        borderRadius: "4px 18px 18px 18px",
                      }
                    : {
                        background: `linear-gradient(135deg, ${character.color}30, ${character.color}18)`,
                        border: `1px solid ${character.color}40`,
                        color: "hsl(var(--foreground))",
                        borderRadius: "18px 4px 18px 18px",
                      }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-end opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
              <img
                src={character.avatar}
                alt={character.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                style={{ border: `1px solid ${character.color}50` }}
              />
              <div
                className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${character.color}20`,
                  borderRadius: "4px 18px 18px 18px",
                }}
              >
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 rounded-full animate-pulse-glow"
                    style={{
                      background: character.color,
                      animationDelay: `${dot * 200}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 py-4 border-t border-border/40 backdrop-blur-sm"
        style={{ background: "rgba(10,10,20,0.7)" }}
      >
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <div
            className="flex-1 flex items-center rounded-2xl px-4 py-3 gap-3 transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid rgba(255,255,255,0.1)`,
            }}
            onFocus={() => {}}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Напиши ${character.name}...`}
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground/50 outline-none disabled:opacity-50"
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${character.color}, ${character.color}cc)`
                : "rgba(255,255,255,0.08)",
              color: "white",
            }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground/40 mt-2">
          Enter — отправить
        </p>
      </div>
    </div>
  );
}
