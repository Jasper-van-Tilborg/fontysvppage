'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ALL_CFGS = [
  { src: '/collage/IMG_1284.JPG',                                        rot: -3   },  // 0
  { src: '/collage/IMG_1301.JPG',                                        rot:  2   },  // 1
  { src: '/collage/IMG_1316.JPG',                                        rot: -1.5 },  // 2
  { src: '/collage/IMG_1412.JPG',                                        rot:  4   },  // 3
  { src: '/collage/IMG_9213.jpeg',                                       rot: -2.5 },  // 4
  { src: '/collage/F97D8D35-CA03-4DDD-92C1-0A0EE7E9D757_1_105_c.jpeg', rot:  1.5 },  // 5
  { src: '/collage/7A0DDFFE-3120-47FA-8298-9EFBAC3834D0_1_105_c.jpeg', rot: -2   },  // 6
  { src: '/collage/E6618724-3291-4FC2-8224-EA3B7D00D9CD_1_102_o.jpeg', rot:  3   },  // 7
  { src: '/collage/Media (7).jpeg',                                      rot:  2.5 },  // 8
  { src: '/collage/Image (1).jpeg',                                      rot: -3.5 },  // 9
];

// Fixed shuffle — eenmalig gerandomiseerd
const CFGS = [6, 2, 8, 4, 0, 3, 9, 5, 1, 7].map(i => ALL_CFGS[i]);

// Phase 1 — willekeurige x-posities (niet gelijkmatig verdeeld)
const LANES = ['6%', '53%', '28%', '62%', '14%', '3%', '57%', '35%', '20%', '47%'];

const TRIGGER_GAP  = 0.06; // gap between image enters → max ~3 visible at once
const TRAVEL_DUR   = 0.26; // each image takes this long to cross the screen
const PHASE2_START = 0.80; // when closing shot begins

const SCROLL_MULT  = 6;
const IMG_W_P1     = 440;  // phase 1 image width

// Per-image Phase 2 config: delay + duration → big stagger differences
const P2_CONFIGS = [
  { delay: 0.00, dur: 0.11 },
  { delay: 0.06, dur: 0.09 },
  { delay: 0.02, dur: 0.13 },
  { delay: 0.09, dur: 0.08 },
  { delay: 0.01, dur: 0.10 },
  { delay: 0.07, dur: 0.12 },
  { delay: 0.04, dur: 0.09 },
  { delay: 0.10, dur: 0.10 },
  { delay: 0.03, dur: 0.11 },
  { delay: 0.08, dur: 0.09 },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Spring pop: grows to 120% then settles at 100%
function springPop(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.72) return easeInOut(t / 0.72) * 1.20;
  return 1.20 - ((t - 0.72) / 0.28) * 0.20;
}

export default function Studio() {
  const t = useTranslations('studio');

  const [progress, setProgress] = useState(0);
  const [vh, setVh]             = useState(900);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentP   = useRef(0);
  const targetP    = useRef(0);
  const rafId      = useRef<number>(0);

  useEffect(() => {
    const upd = () => setVh(window.innerHeight);
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  useEffect(() => {
    const calc = () => {
      if (!wrapperRef.current) return 0;
      const rect = wrapperRef.current.getBoundingClientRect();
      return Math.max(0, Math.min(1, -rect.top / ((SCROLL_MULT - 1) * vh)));
    };
    const onScroll = () => { targetP.current = calc(); };
    const loop = () => {
      currentP.current += (targetP.current - currentP.current) * 0.08;
      setProgress(currentP.current);
      rafId.current = requestAnimationFrame(loop);
    };
    targetP.current = calc();
    rafId.current   = requestAnimationFrame(loop);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [vh]);

  // THE STUDIO — fill enters left→right; diagonal swipe wipe-out when closing shot starts
  const TEXT_EXIT_DUR  = 0.08;
  const textExitP      = Math.max(0, Math.min(1, (progress - PHASE2_START) / TEXT_EXIT_DUR));
  const fillInP        = Math.min(1, progress / PHASE2_START);
  const fillClip       = `inset(0 ${(1 - fillInP) * 100}% 0 0)`;
  // Diagonal wipe: sweeps right→left with ~45° slant
  const wx_top         = (1 - textExitP) * 160 - 10;  // top-right edge: 150% → -10%
  const wx_bot         = wx_top - 55;                   // bottom-right edge (creates diagonal)
  const textWipeClip   = textExitP > 0
    ? `polygon(0% 0%, ${wx_top}% 0%, ${wx_bot}% 100%, 0% 100%)`
    : 'none';

  const inPhase2 = progress >= PHASE2_START - 0.02;

  const IMG_H_P1 = Math.round(IMG_W_P1 * 0.67);

  return (
    <>
      {/* ── Mobile ── */}
      <div className="block md:hidden" style={{ background: '#000', padding: '80px 20px' }}>
        <p style={{ fontFamily: 'var(--font-chakra-petch)', fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
          05 — Studio
        </p>
        <h2 style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: '2rem', letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase', marginBottom: '32px' }}>
          {t('heading')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CFGS.map((cfg, i) => (
            <div key={cfg.src} style={{ overflow: 'hidden', aspectRatio: '1.5' }}>
              <Image src={cfg.src} alt={`VP studio ${i + 1}`} width={400} height={267} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop ── */}
      <div ref={wrapperRef} className="hidden md:block" style={{ height: `${SCROLL_MULT * 100}vh` }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#000', overflow: 'hidden' }}>

          {/* THE STUDIO */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{ position: 'relative', clipPath: textWipeClip }}>
              <span style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(9vw, 12vw, 16vw)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', visibility: 'hidden', display: 'block' }}>
                THE STUDIO
              </span>
              <span style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(9vw, 12vw, 16vw)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', WebkitTextStroke: '2px rgba(255,255,255,0.18)', color: 'transparent', display: 'block' }}>
                THE STUDIO
              </span>
              <span style={{ position: 'absolute', inset: 0, fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(9vw, 12vw, 16vw)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: '#fff', display: 'block', clipPath: fillClip }}>
                THE STUDIO
              </span>
            </div>
          </div>

          {/* ── Phase 1: images drift continuously downward ── */}
          {CFGS.map((cfg, i) => {
            const trigger = i * TRIGGER_GAP;
            const rp      = progress - trigger;
            const travelP = rp / TRAVEL_DUR;

            // Fade in top 25%, full middle, fade out bottom 25%
            let p1opacity = 0;
            if (travelP > 0 && travelP < 1) {
              p1opacity = travelP < 0.50 ? travelP / 0.50
                        : travelP > 0.50 ? (1 - travelP) / 0.50
                        : 1;
            }
            // Fade out entirely as phase 2 approaches
            p1opacity *= Math.max(0, 1 - Math.max(0, (progress - (PHASE2_START - 0.06)) / 0.06));

            const translateY = -IMG_H_P1 + travelP * (vh + IMG_H_P1);

            return (
              <div
                key={`p1-${cfg.src}`}
                style={{
                  position: 'absolute',
                  left: LANES[i],
                  top: 0,
                  width: IMG_W_P1,
                  zIndex: 2,
                  transform: `translateY(${translateY}px) rotate(${cfg.rot}deg)`,
                  opacity: p1opacity,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.5)',
                  willChange: 'transform, opacity',
                }}
              >
                <Image src={cfg.src} alt={`VP studio ${i + 1}`} width={IMG_W_P1} height={IMG_H_P1} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            );
          })}

          {/* ── Phase 2: closing shot — grid aligned to page layout ── */}
          {inPhase2 && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '1280px',
                padding: '0 80px',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(2, 38vh)',
                gap: '8px',
              }}>
                {CFGS.map((cfg, i) => {
                  const { delay, dur } = P2_CONFIGS[i];
                  const imgP2Raw = Math.max(0, Math.min(1, (progress - PHASE2_START - delay) / dur));
                  const scale    = springPop(imgP2Raw);
                  const opacity  = Math.min(1, imgP2Raw * 6);
                  return (
                    <div
                      key={`p2-${cfg.src}`}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        opacity,
                        boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.4)',
                        outline: '1px solid rgba(255,255,255,0.06)',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <Image src={cfg.src} alt={`VP studio ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                      {/* subtle bottom vignette for editorial depth */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
