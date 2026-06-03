'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'next/navigation';

export const HERO_PHASES = [
  'off', 'powering', 'blueprint',
  'flash', 'glitch', 'border', 'grid', 'reveal', 'done',
] as const;

export type HeroPhase = (typeof HERO_PHASES)[number];

export function heroGte(current: HeroPhase, target: HeroPhase) {
  return HERO_PHASES.indexOf(current) >= HERO_PHASES.indexOf(target);
}

interface HeroCtx {
  phase: HeroPhase;
  setPhase: (p: HeroPhase) => void;
}

const HeroContext = createContext<HeroCtx>({ phase: 'off', setPhase: () => {} });

const SCHEDULE: [HeroPhase, number][] = [
  ['blueprint', 280],
  ['flash',     2550],
  ['glitch',    3100],
  ['border',    3800],
  ['grid',      4620],
  ['reveal',    5220],
  ['done',      6900],
];

export function HeroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhaseRaw] = useState<HeroPhase>('off');
  const params = useParams();
  const locale = params?.locale as string | undefined;

  function setPhase(p: HeroPhase) {
    setPhaseRaw(p);
    if (p === 'done') sessionStorage.setItem('vpHeroPlayed', '1');
  }

  // On first mount: if animation already played, skip to done
  useEffect(() => {
    if (sessionStorage.getItem('vpHeroPlayed') === '1') {
      setPhaseRaw('done');
    }
  }, []);

  // On locale change (soft navigation): detect autoPlay flag and run animation
  useEffect(() => {
    if (!locale) return;

    const isAutoPlay = sessionStorage.getItem('vpAutoPlay') === '1';
    if (!isAutoPlay) return;
    sessionStorage.removeItem('vpAutoPlay');

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setPhaseRaw('powering');

    const timers = SCHEDULE.map(([p, ms]) =>
      setTimeout(() => {
        setPhaseRaw(p);
        if (p === 'done') sessionStorage.setItem('vpHeroPlayed', '1');
      }, ms)
    );

    return () => timers.forEach(clearTimeout);
  }, [locale]);

  return (
    <HeroContext.Provider value={{ phase, setPhase }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHeroPhase() {
  return useContext(HeroContext);
}
