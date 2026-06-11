'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const SCROLL_MULT = 3;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function ProgrammeNew() {
  const t      = useTranslations('programme');
  const phases = t.raw('phases') as Array<{
    number: string; title: string; description: string;
    icon: string; tags: string[];
  }>;

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

  const headingP = Math.max(0, Math.min(1, progress / 0.14));

  return (
    <div ref={wrapperRef} style={{ height: `${SCROLL_MULT * 100}vh` }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#000', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 80px',
      }}>

        {/* Background watermark */}
        <div aria-hidden style={{
          position: 'absolute', left: '-0.05em', bottom: '-0.15em',
          fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
          fontSize: '38vw', lineHeight: 1, color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.025)',
          pointerEvents: 'none', userSelect: 'none', zIndex: 0,
        }}>
          04
        </div>

        {/* Heading */}
        <div style={{
          marginBottom: '56px', zIndex: 1,
          opacity: headingP,
          transform: `translateY(${(1 - headingP) * 14}px)`,
        }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-chakra-petch)',
            fontSize: '10px', letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            04 — Programme
          </span>
          <span style={{
            display: 'block', fontFamily: 'var(--font-chakra-petch)',
            fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)',
            letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase',
          }}>
            {t('heading')}
          </span>
        </div>

        {/* Cards — shared perspective so all share the same vanishing point */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          perspective: '1400px', zIndex: 1,
        }}>
          {phases.map((phase, i) => {
            const cardStart = 0.14 + i * 0.22;
            const cardEnd   = cardStart + 0.26;
            const raw  = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)));
            const p    = easeOutExpo(raw);
            const rotY = (1 - p) * 72;   // 72° → 0°, like a card placed face-up
            const opacity = Math.min(1, raw * 5);

            return (
              <div
                key={i}
                style={{
                  transform: `rotateY(${rotY}deg)`,
                  transformOrigin: 'center center',
                  opacity,
                  willChange: 'transform, opacity',
                }}
              >
                <div style={{
                  background: '#080808',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '44px 40px',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                  height: '100%',
                }}>

                  {/* Icon + phase number */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Image src={phase.icon} alt={phase.title} width={44} height={44} style={{ opacity: 0.9 }} />
                    <span style={{
                      fontFamily: 'var(--font-chakra-petch)', fontSize: '0.75rem',
                      letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)',
                      textTransform: 'uppercase',
                    }}>
                      {phase.number}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(91,153,189,0.25)' }} />

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', letterSpacing: '0.02em',
                    color: '#fff', lineHeight: 1.1, textTransform: 'uppercase',
                    margin: 0,
                  }}>
                    {phase.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                    lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: 0,
                    flex: 1,
                  }}>
                    {phase.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {phase.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'var(--font-chakra-petch)', fontSize: '0.65rem',
                        letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '4px 10px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
