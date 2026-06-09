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
const IMG_W_P2     = 300;  // phase 2 (closing shot) image width

// Small individual delays within phase 2 — organic stagger
const P2_DELAYS = [0.00, 0.025, 0.012, 0.038, 0.018, 0.030, 0.006, 0.044, 0.022, 0.010];

// Phase 2 — all images appear at once in a scattered grid
const CLOSING = [
  { left: '1%',  top: '2%',  rot: -2   },
  { left: '26%', top: '0%',  rot:  1.5 },
  { left: '51%', top: '3%',  rot: -1   },
  { left: '74%', top: '1%',  rot:  3   },
  { left: '1%',  top: '36%', rot:  2   },
  { left: '26%', top: '38%', rot: -2.5 },
  { left: '51%', top: '37%', rot:  1   },
  { left: '74%', top: '39%', rot: -1.5 },
  { left: '15%', top: '70%', rot:  3   },
  { left: '52%', top: '68%', rot: -1   },
];

// Ease: smooth out → smooth in
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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

  // THE STUDIO fill
  const fillClip = `inset(0 ${(1 - Math.min(1, progress / PHASE2_START)) * 100}% 0 0)`;

  // Phase 2 scale (0 → 1 as progress goes PHASE2_START → 1)
  const p2Raw   = Math.max(0, Math.min(1, (progress - PHASE2_START) / 0.20));
  const p2      = easeInOut(p2Raw);
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
            <div style={{ position: 'relative' }}>
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
                  boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
                  willChange: 'transform, opacity',
                }}
              >
                <Image src={cfg.src} alt={`VP studio ${i + 1}`} width={IMG_W_P1} height={IMG_H_P1} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            );
          })}

          {/* ── Phase 2: all images scale in together ── */}
          {inPhase2 && CFGS.map((cfg, i) => {
            const imgP2Raw  = Math.max(0, Math.min(1, (progress - PHASE2_START - P2_DELAYS[i]) / 0.20));
            const imgP2     = easeInOut(imgP2Raw);
            const scale     = 0.88 + imgP2 * 0.12;
            const translateY = (1 - imgP2) * 28;
            const opacity   = imgP2;
            const pos     = CLOSING[i];

            return (
              <div
                key={`p2-${cfg.src}`}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  width: IMG_W_P2,
                  zIndex: 3,
                  transform: `translateY(${translateY}px) rotate(${pos.rot}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity,
                  filter: 'none',
                  boxShadow: '0 16px 50px rgba(0,0,0,0.8)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                <Image src={cfg.src} alt={`VP studio ${i + 1}`} width={IMG_W_P2} height={Math.round(IMG_W_P2 * 0.67)} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}
