import { useState, useCallback } from "react";

export type SubscriptionPlan = "free" | "premium";

export type EconomyState = {
  crystals: number;
  subscription: SubscriptionPlan;
  adsWatched: number;
};

export type EconomyActions = {
  addCrystals: (amount: number) => void;
  spendCrystals: (amount: number) => boolean;
  watchAd: () => void;
  subscribe: () => boolean;
  canAfford: (amount: number) => boolean;
  isPremium: boolean;
};

const INITIAL_CRYSTALS = 50;

export function useEconomy(): EconomyState & EconomyActions {
  const [crystals, setCrystals] = useState(INITIAL_CRYSTALS);
  const [subscription, setSubscription] = useState<SubscriptionPlan>("free");
  const [adsWatched, setAdsWatched] = useState(0);

  const isPremium = subscription === "premium";

  const addCrystals = useCallback((amount: number) => {
    setCrystals((prev) => prev + amount);
  }, []);

  const spendCrystals = useCallback((amount: number): boolean => {
    if (crystals < amount) return false;
    setCrystals((prev) => prev - amount);
    return true;
  }, [crystals]);

  const canAfford = useCallback((amount: number): boolean => {
    return crystals >= amount;
  }, [crystals]);

  const watchAd = useCallback(() => {
    setAdsWatched((prev) => prev + 1);
    setCrystals((prev) => prev + 15);
  }, []);

  const subscribe = useCallback((): boolean => {
    const cost = 299;
    if (crystals < cost) return false;
    setCrystals((prev) => prev - cost);
    setSubscription("premium");
    return true;
  }, [crystals]);

  return {
    crystals,
    subscription,
    adsWatched,
    addCrystals,
    spendCrystals,
    canAfford,
    watchAd,
    subscribe,
    isPremium,
  };
}
