'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const SCROLL_MULT = 3;
const HEADER_END  = 0.12;
const BAND_GAP    = 0.17;   // stagger between bands
const BAND_DUR    = 0.22;   // each band's reveal duration

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function Why() {
  const t     = useTranslations('why');
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>;

  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentP   = useRef(0);
  const targetP    = useRef(0);
  const rafId      = useRef<number>(0);

  useEffect(() => {
    const calc = () => {
      if (!wrapperRef.current) return 0;
      const rect = wrapperRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
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
  }, []);

  // Header fade-in
  const headerP = Math.max(0, Math.min(1, progress / HEADER_END));

  return (
    <div ref={wrapperRef} id="why" style={{ height: `${SCROLL_MULT * 100}vh` }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#000', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: '60px 80px',
      }}>

        {/* Background section watermark */}
        <div aria-hidden style={{
          position: 'absolute', right: '-0.05em', bottom: '-0.15em',
          fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
          fontSize: '38vw', lineHeight: 1, color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.025)',
          pointerEvents: 'none', userSelect: 'none', zIndex: 0,
        }}>
          03
        </div>

        {/* Header */}
        <div style={{
          marginBottom: '40px', zIndex: 1,
          opacity: headerP,
          transform: `translateY(${(1 - headerP) * 14}px)`,
          flexShrink: 0,
        }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-chakra-petch)',
            fontSize: '10px', letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            03 — Why
          </span>
          <span style={{
            display: 'block', fontFamily: 'var(--font-chakra-petch)',
            fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)',
            letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase',
          }}>
            {t('heading')}
          </span>
        </div>

        {/* Horizontal bands */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, overflow: 'hidden' }}>
          {items.map((item, i) => {
            const bandStart = HEADER_END + i * BAND_GAP;
            const raw = Math.max(0, Math.min(1, (progress - bandStart) / BAND_DUR));
            const p   = easeOutCubic(raw);

            // Even bands slide from left, odd from right
            const fromLeft = i % 2 === 0;
            const tx = (fromLeft ? -1 : 1) * (1 - p) * 110;
            const opacity = Math.min(1, raw * 3.5);

            return (
              <div
                key={item.number}
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: '80px 1px 1fr 2.2fr',
                  columnGap: '36px',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  transform: `translateX(${tx}px)`,
                  opacity,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Number */}
                <span style={{
                  fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1,
                  letterSpacing: '-0.02em', color: '#5b99bd',
                }}>
                  {item.number}
                </span>

                {/* Vertical accent — grows upward as band slides in */}
                <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', bottom: 0, width: '100%',
                    height: `${p * 100}%`,
                    background: 'linear-gradient(to top, #5b99bd, rgba(91,153,189,0.2))',
                  }} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
                  fontSize: 'clamp(0.9rem, 1.4vw, 1.3rem)', letterSpacing: '0.05em',
                  lineHeight: 1.2, color: '#fff', textTransform: 'uppercase',
                  margin: 0,
                }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                  lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: 0,
                }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
