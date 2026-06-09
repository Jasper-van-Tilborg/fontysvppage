'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const SCROLL_MULT = 4;

function Typed({ text, progress, start, end, className, style }: {
  text: string;
  progress: number;
  start: number;
  end: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const p = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  const visible = Math.floor(text.length * p);
  return (
    <span className={className} style={style}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ opacity: i < visible ? 1 : 0 }}>
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Why() {
  const t = useTranslations('why');
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>;

  const [progress, setProgress]   = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
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

  return (
    <div ref={wrapperRef} id="why" style={{ height: `${SCROLL_MULT * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', overflow: 'hidden' }}>

        {/* Heading */}
        <div style={{ marginBottom: '48px' }}>
          <Typed
            text="03 — Why"
            progress={progress}
            start={0.02} end={0.18}
            className="text-white/40 uppercase"
            style={{ display: 'block', fontFamily: 'var(--font-chakra-petch)', fontSize: '10px', letterSpacing: '0.35em', marginBottom: '16px' }}
          />
          <Typed
            text={t('heading')}
            progress={progress}
            start={0.15} end={0.55}
            className="text-white uppercase"
            style={{ display: 'block', fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', letterSpacing: '0.04em' }}
          />
        </div>

        {/* 4-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {items.map((item, i) => {
            const hovered   = hoveredIdx === i;
            const cardStart = 0.45 + i * 0.10;
            const cardEnd   = cardStart + 0.15;
            const p = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)));

            return (
              <div
                key={item.number}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: 'relative',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  overflow: 'hidden',
                  cursor: 'default',
                  background: '#000',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 32}px)`,
                }}
              >
                {/* Watermark */}
                <span aria-hidden style={{ position: 'absolute', fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(6rem, 10vw, 9rem)', lineHeight: 1, color: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)', top: '-0.15em', right: '-0.05em', transition: 'color 350ms ease', userSelect: 'none', pointerEvents: 'none' }}>
                  {item.number}
                </span>
                <span style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: '2.8rem', lineHeight: 1, letterSpacing: '-0.02em', color: '#5b99bd' }}>
                  {item.number}
                </span>
                <div style={{ height: '1px', background: 'rgba(91,153,189,0.3)' }} />
                <h3 style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)', letterSpacing: '0.05em', lineHeight: 1.2, color: '#fff', textTransform: 'uppercase' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', marginTop: 'auto' }}>
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
