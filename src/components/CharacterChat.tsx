import { useState, useRef, useEffect } from "react";
import { Character } from "@/pages/Index";
import { EconomyState, EconomyActions } from "@/hooks/useEconomy";
import Icon from "@/components/ui/icon";

type Message = {
  id: string;
  role: "user" | "character" | "system";
  text: string;
  mode?: ChatMode;
};

export type ChatMode = "normal" | "deep" | "roleplay" | "philosophy";

type Props = {
  character: Character;
  onBack: () => void;
  economy: EconomyState & EconomyActions;
};

const MODES: { id: ChatMode; label: string; icon: string; cost: number; desc: string; color: string }[] = [
  { id: "normal",     label: "Обычный",     icon: "MessageCircle", cost: 0,  desc: "Стандартный разговор",         color: "#94a3b8" },
  { id: "deep",       label: "Глубокий",    icon: "Brain",         cost: 5,  desc: "Детальные развёрнутые ответы", color: "#22d3ee" },
  { id: "roleplay",   label: "Ролевой",     icon: "Theater",       cost: 8,  desc: "Персонаж полностью в роли",    color: "#fb7185" },
  { id: "philosophy", label: "Философский", icon: "Sparkles",      cost: 10, desc: "Глубокие размышления и смыслы", color: "#a855f7" },
];

const STARTERS: Record<string, string[]> = {
  "1": ["Скажи мне, путник — что ты ищешь в глубинах своей души?", "Тишина говорит больше слов. Что привело тебя ко мне?"],
  "2": ["Я видел тысячи судеб. Твоя — особенная. Спрашивай.", "Прошлое и будущее переплетены. Что тебя тревожит?"],
  "3": ["Привет! Готова к абсолютно любому безумию. Что взорвём сегодня? 😈", "О, новый собеседник! С чего начнём — с философии или мемов?"],
  "4": ["Добро пожаловать. Я чувствую, тебе есть что сказать. Я здесь.", "Каждая встреча — это маленькое чудо. Расскажи мне о себе."],
};

const LEARNING_TASKS = [
  { id: "l1", text: "Спроси о смысле жизни", reward: 20, done: false },
  { id: "l2", text: "Отправь 5 сообщений", reward: 15, done: false },
  { id: "l3", text: "Спроси об истории персонажа", reward: 25, done: false },
];

const MODE_REPLIES: Record<ChatMode, string[]> = {
  normal: [
    "Интересная мысль. Что ты сам об этом думаешь?",
    "Да, я понимаю. Расскажи подробнее.",
    "Хм, это стоит обдумать. Что привело тебя к такому выводу?",
  ],
  deep: [
    "Позволь развернуть эту мысль детально. В основе лежит фундаментальное противоречие между тем, что мы ощущаем, и тем, что реально существует. Каждое твоё слово несёт слои смыслов, которые стоит исследовать последовательно.",
    "Это глубже, чем кажется. На первом уровне — очевидный смысл. На втором — личный контекст. За ним — универсальный архетип, объединяющий нас всех. Давай пройдём все три.",
  ],
  roleplay: [
    "*задумчиво смотрит вдаль* Ты пришёл в нужное время... Я давно ждал этого разговора. Слушай внимательно.",
    "*медленно поворачивается* В мире, где всё — иллюзия, лишь наш диалог реален. Продолжай. Я — здесь. Только для тебя.",
  ],
  philosophy: [
    "Если мы допустим, что реальность — конструкт восприятия, твой вопрос становится зеркалом. То, что ты видишь в нём — и есть ответ. Что ты видишь?",
    "Сократ говорил: «Я знаю, что ничего не знаю». Но даже это — уже знание. Парадокс. Твой вопрос содержит ответ внутри себя. Ощути это.",
  ],
};

function getStarter(c: Character): string {
  const pool = STARTERS[c.id] ?? [`Привет! Я ${c.name}. Чем могу помочь?`];
  return pool[Math.floor(Math.random() * pool.length)];
}

function simulateReply(mode: ChatMode): Promise<string> {
  const pool = MODE_REPLIES[mode];
  const reply = pool[Math.floor(Math.random() * pool.length)];
  const delay = mode === "normal" ? 800 + Math.random() * 800 : 1400 + Math.random() * 1000;
  return new Promise((res) => setTimeout(() => res(reply), delay));
}

export default function CharacterChat({ character, onBack, economy }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "character", text: getStarter(character), mode: "normal" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("normal");
  const [showModes, setShowModes] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [tasks, setTasks] = useState(LEARNING_TASKS);
  const [showTasks, setShowTasks] = useState(false);
  const [toast, setToast] = useState<{ text: string; crystals: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showToastMsg = (text: string, crystals: number) => {
    setToast({ text, crystals });
    setTimeout(() => setToast(null), 3000);
  };

  const checkLearningTasks = (text: string, count: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.done) return t;
        if (t.id === "l1" && /смысл|жизн|зачем|цель/i.test(text)) {
          economy.addCrystals(t.reward);
          showToastMsg(t.text, t.reward);
          return { ...t, done: true };
        }
        if (t.id === "l2" && count >= 5) {
          economy.addCrystals(t.reward);
          showToastMsg("5 сообщений отправлено!", t.reward);
          return { ...t, done: true };
        }
        if (t.id === "l3" && /расскаж|история|кто ты|откуда/i.test(text)) {
          economy.addCrystals(t.reward);
          showToastMsg(t.text, t.reward);
          return { ...t, done: true };
        }
        return t;
      })
    );
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const currentMode = mode;
    const modeDef = MODES.find((m) => m.id === currentMode)!;

    if (modeDef.cost > 0 && !economy.isPremium) {
      const ok = economy.spendCrystals(modeDef.cost);
      if (!ok) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "system", text: `Недостаточно кристаллов для режима «${modeDef.label}». Пополни баланс 💎` },
        ]);
        return;
      }
    }

    setInput("");
    const newCount = msgCount + 1;
    setMsgCount(newCount);

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text, mode: currentMode }]);
    setLoading(true);
    checkLearningTasks(text, newCount);

    const reply = await simulateReply(currentMode);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "character", text: reply, mode: currentMode },
    ]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const selectMode = (m: ChatMode) => {
    const def = MODES.find((x) => x.id === m)!;
    if (def.cost > 0 && !economy.isPremium && !economy.canAfford(def.cost)) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "system", text: `Для режима «${def.label}» нужно ${def.cost} 💎 за сообщение. Пополни баланс.` },
      ]);
      setShowModes(false);
      return;
    }
    setMode(m);
    setShowModes(false);
  };

  const currentModeDef = MODES.find((m) => m.id === mode)!;
  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 backdrop-blur-sm flex-shrink-0"
        style={{ background: "rgba(10,10,20,0.85)" }}>
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors group">
          <Icon name="ArrowLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative">
          <img src={character.avatar} alt={character.name}
            className="w-9 h-9 rounded-full object-cover"
            style={{ border: `2px solid ${character.color}60` }} />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background animate-pulse-glow"
            style={{ background: character.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-display text-base text-white leading-none">{character.name}</div>
          <div className="text-xs mt-0.5 flex items-center gap-1.5">
            <span style={{ color: currentModeDef.color }}>● {currentModeDef.label}</span>
            {currentModeDef.cost > 0 && !economy.isPremium && (
              <span className="text-muted-foreground/50">· {currentModeDef.cost} 💎/сообщ.</span>
            )}
            {economy.isPremium && currentModeDef.cost > 0 && (
              <span className="text-xs" style={{ color: "#f59e0b" }}>· PRO</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setShowTasks(!showTasks)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-90"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
            <Icon name="GraduationCap" size={12} />
            <span>{doneTasks}/{tasks.length}</span>
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <span className="text-sm">💎</span>
            <span className="text-sm font-semibold text-white">{economy.crystals}</span>
          </div>
        </div>
      </div>

      {/* Learning tasks */}
      {showTasks && (
        <div className="border-b border-border/30 px-4 py-3 flex-shrink-0"
          style={{ background: "rgba(74,222,128,0.04)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Icon name="GraduationCap" size={11} />
              Задания обучения — зарабатывай кристаллы
            </div>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: t.done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${t.done ? "#4ade80" : "rgba(255,255,255,0.1)"}` }}>
                      {t.done && <Icon name="Check" size={9} className="text-green-400" />}
                    </div>
                    <span className={t.done ? "line-through text-muted-foreground/50 text-sm" : "text-foreground/80 text-sm"}>{t.text}</span>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: t.done ? "#4ade80" : "#a855f7" }}>
                    {t.done ? "✓ получено" : `+${t.reward} 💎`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 min-h-0">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg, i) => {
            if (msg.role === "system") return (
              <div key={msg.id} className="text-center py-1">
                <span className="text-xs px-3 py-1.5 rounded-full inline-block"
                  style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185" }}>
                  {msg.text}
                </span>
              </div>
            );

            const msgModeDef = MODES.find((m) => m.id === (msg.mode ?? "normal"))!;
            return (
              <div key={msg.id}
                className="flex gap-2.5 opacity-0 animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 25, 120)}ms`, animationFillMode: "forwards", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "character" && (
                  <img src={character.avatar} alt={character.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1"
                    style={{ border: `1px solid ${character.color}50` }} />
                )}
                <div className="max-w-[78%]">
                  {msg.role === "character" && msg.mode && msg.mode !== "normal" && (
                    <div className="text-xs mb-1 flex items-center gap-1" style={{ color: msgModeDef.color }}>
                      <Icon name={msgModeDef.icon} size={10} fallback="Star" />
                      {msgModeDef.label}
                    </div>
                  )}
                  <div className="px-4 py-2.5 text-sm leading-relaxed"
                    style={msg.role === "character"
                      ? { background: "rgba(255,255,255,0.06)", border: `1px solid ${character.color}20`, color: "hsl(var(--foreground))", borderRadius: "4px 18px 18px 18px" }
                      : { background: `${character.color}25`, border: `1px solid ${character.color}40`, color: "hsl(var(--foreground))", borderRadius: "18px 4px 18px 18px" }
                    }>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-end opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
              <img src={character.avatar} alt={character.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                style={{ border: `1px solid ${character.color}50` }} />
              <div className="px-4 py-3 flex gap-1.5 items-center"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${character.color}20`, borderRadius: "4px 18px 18px 18px" }}>
                {[0, 1, 2].map((d) => (
                  <div key={d} className="w-2 h-2 rounded-full animate-pulse-glow"
                    style={{ background: character.color, animationDelay: `${d * 200}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Mode selector */}
      {showModes && (
        <div className="border-t border-border/30 px-4 py-3 flex-shrink-0"
          style={{ background: "rgba(10,10,20,0.95)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">Режим разговора</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MODES.map((m) => {
                const canUse = economy.isPremium || m.cost === 0 || economy.canAfford(m.cost);
                return (
                  <button key={m.id} onClick={() => selectMode(m.id)}
                    className="flex flex-col items-start gap-1.5 p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: mode === m.id ? `${m.color}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${mode === m.id ? m.color + "60" : "rgba(255,255,255,0.08)"}`,
                      opacity: canUse ? 1 : 0.55,
                    }}>
                    <div className="flex items-center justify-between w-full">
                      <Icon name={m.icon} size={14} fallback="Star" style={{ color: m.color }} />
                      {m.cost > 0 ? (
                        <span className="text-xs font-semibold" style={{ color: economy.isPremium ? "#4ade80" : m.color }}>
                          {economy.isPremium ? "✓ PRO" : `${m.cost} 💎`}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">free</span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-white">{m.label}</div>
                    <div className="text-xs text-muted-foreground/60 leading-tight">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/40 backdrop-blur-sm flex-shrink-0"
        style={{ background: "rgba(10,10,20,0.9)" }}>
        <div className="max-w-2xl mx-auto flex gap-2 items-center">
          <button onClick={() => setShowModes(!showModes)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
            style={{
              background: showModes ? `${currentModeDef.color}20` : "rgba(255,255,255,0.05)",
              border: `1px solid ${showModes ? currentModeDef.color + "50" : "rgba(255,255,255,0.1)"}`,
            }}
            title="Режим разговора">
            <Icon name={currentModeDef.icon} size={16} fallback="MessageCircle" style={{ color: currentModeDef.color }} />
          </button>

          <div className="flex-1 flex items-center rounded-xl px-4 py-2.5"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <input ref={inputRef} type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey} disabled={loading}
              placeholder={`Напиши ${character.name}...`}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground/40 outline-none disabled:opacity-50" />
          </div>

          <button onClick={send} disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !loading ? `linear-gradient(135deg, ${character.color}, ${character.color}bb)` : "rgba(255,255,255,0.05)",
              color: "white",
            }}>
            <Icon name="Send" size={15} />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground/25 mt-1.5">
          Enter — отправить · <span style={{ color: currentModeDef.color + "80" }}>{currentModeDef.label}</span>
        </p>
      </div>

      {/* Crystal toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl flex items-center gap-3 animate-scale-in"
          style={{ background: "rgba(15,15,25,0.95)", border: "1px solid rgba(74,222,128,0.4)", backdropFilter: "blur(16px)", boxShadow: "0 0 30px rgba(74,222,128,0.2)" }}>
          <Icon name="GraduationCap" size={16} className="text-green-400" />
          <span className="text-sm text-white">{toast.text}</span>
          <span className="font-bold text-green-400 text-sm">+{toast.crystals} 💎</span>
        </div>
      )}
    </div>
  );
}