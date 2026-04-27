import { useState } from "react";
import { EconomyState, EconomyActions } from "@/hooks/useEconomy";
import Icon from "@/components/ui/icon";

type Props = {
  open: boolean;
  onClose: () => void;
  economy: EconomyState & EconomyActions;
};

const CRYSTAL_PACKS = [
  { id: "p1", crystals: 50,   price: "59 ₽",   label: "Стартовый",  bonus: "",       color: "#94a3b8" },
  { id: "p2", crystals: 150,  price: "149 ₽",  label: "Популярный", bonus: "+10%",   color: "#22d3ee", popular: true },
  { id: "p3", crystals: 400,  price: "349 ₽",  label: "Выгодный",   bonus: "+30%",   color: "#a855f7" },
  { id: "p4", crystals: 1000, price: "799 ₽",  label: "Максимум",   bonus: "+100%",  color: "#f59e0b" },
];

const SUB_COST = 299;

export default function ShopModal({ open, onClose, economy }: Props) {
  const [tab, setTab] = useState<"crystals" | "premium">("crystals");
  const [bought, setBought] = useState<string | null>(null);

  if (!open) return null;

  const handleBuyCrystals = (pack: typeof CRYSTAL_PACKS[0]) => {
    economy.addCrystals(pack.crystals);
    setBought(pack.id);
    setTimeout(() => setBought(null), 1800);
  };

  const handleSubscribe = () => {
    const ok = economy.subscribe();
    if (!ok) {
      setBought("nosub");
      setTimeout(() => setBought(null), 2000);
    } else {
      setBought("sub");
      setTimeout(() => { setBought(null); onClose(); }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />

      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden animate-scale-in"
        style={{ background: "linear-gradient(160deg, hsl(240,12%,9%), hsl(240,12%,6%))", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display text-2xl text-white">Магазин</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Баланс: <span className="text-white font-medium">{economy.crystals} 💎</span>
                {economy.isPremium && <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "linear-gradient(135deg,#f59e0b,#fb923c)", color: "white" }}>PRO</span>}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["crystals", "premium"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={tab === t
                  ? { background: "rgba(168,85,247,0.2)", color: "#c084fc", borderRadius: "10px" }
                  : { color: "hsl(var(--muted-foreground))" }}>
                {t === "crystals" ? "💎 Кристаллы" : "👑 Подписка"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {tab === "crystals" && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground mb-4">
                Кристаллы тратятся на платные режимы разговора. Также можно заработать — смотри рекламу или выполняй задания в чате.
              </div>
              {CRYSTAL_PACKS.map((pack) => (
                <button key={pack.id} onClick={() => handleBuyCrystals(pack)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: bought === pack.id ? `${pack.color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${pack.popular ? pack.color + "50" : bought === pack.id ? pack.color + "60" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: pack.popular ? `0 0 20px ${pack.color}15` : "none",
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${pack.color}15`, border: `1px solid ${pack.color}30` }}>
                      💎
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{pack.crystals} кристаллов</span>
                        {pack.bonus && <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${pack.color}20`, color: pack.color }}>
                          {pack.bonus}
                        </span>}
                        {pack.popular && <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: "rgba(34,211,238,0.2)", color: "#22d3ee" }}>
                          Популярный
                        </span>}
                      </div>
                      <div className="text-sm text-muted-foreground">{pack.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {bought === pack.id
                      ? <span className="text-sm font-medium text-green-400">✓ Получено!</span>
                      : <span className="font-semibold text-white">{pack.price}</span>
                    }
                  </div>
                </button>
              ))}

              {/* Watch ad */}
              <button onClick={() => economy.watchAd()}
                className="w-full flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px dashed rgba(245,158,11,0.3)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
                    <Icon name="Play" size={18} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">Смотреть рекламу</div>
                    <div className="text-sm text-muted-foreground">30 секунд · бесплатно</div>
                  </div>
                </div>
                <span className="font-semibold text-yellow-400">+15 💎</span>
              </button>
            </div>
          )}

          {tab === "premium" && (
            <div>
              <div
                className="rounded-2xl p-5 mb-4"
                style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,146,60,0.08))", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="font-display text-xl text-white">Anima PRO</div>
                    <div className="text-sm text-muted-foreground">Подписка на 30 дней</div>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  {[
                    "Все режимы разговора без ограничений",
                    "Без рекламы навсегда",
                    "Приоритетный доступ к новым персонажам",
                    "Ежедневный бонус +30 💎",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Icon name="Check" size={14} className="text-yellow-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">299 💎</div>
                    <div className="text-xs text-muted-foreground">или ~299 ₽ через пополнение</div>
                  </div>
                  {economy.isPremium && (
                    <div className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: "rgba(74,222,128,0.2)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                      ✓ Активна
                    </div>
                  )}
                </div>

                {!economy.isPremium && (
                  <button onClick={handleSubscribe}
                    className="w-full py-3.5 rounded-xl font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #fb923c)", boxShadow: "0 0 20px rgba(245,158,11,0.3)" }}>
                    {bought === "nosub"
                      ? "Недостаточно кристаллов 💎"
                      : bought === "sub"
                      ? "✓ Подписка активирована!"
                      : "Оформить подписку за 299 💎"}
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground/60 text-center">
                Подписка списывается кристаллами из баланса. Пополни баланс при необходимости.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
