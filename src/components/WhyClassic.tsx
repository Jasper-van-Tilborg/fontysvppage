'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';

export default function WhyClassic() {
  const t     = useTranslations('why');
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>;

  const [visible, setVisible]       = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay = 0): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="why"
      style={{
        background: '#000', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '120px 80px',
      }}
    >

      <div style={{ marginBottom: '48px' }}>
        <span style={{
          display: 'block', fontFamily: 'var(--font-chakra-petch)', fontSize: '10px',
          letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
          marginBottom: '16px', ...reveal(0),
        }}>
          03 — Why
        </span>
        <h2 style={{
          fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
          fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', letterSpacing: '0.04em',
          color: '#fff', textTransform: 'uppercase', margin: 0,
          ...reveal(0.1),
        }}>
          {t('heading')}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {items.map((item, i) => {
          const hovered = hoveredIdx === i;
          return (
            <div key={item.number}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'relative', padding: '40px',
                display: 'flex', flexDirection: 'column', gap: '24px',
                overflow: 'hidden', cursor: 'default', background: '#000',
                ...reveal(0.2 + i * 0.1),
              }}
            >
              <span aria-hidden style={{
                position: 'absolute', fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
                fontSize: 'clamp(6rem, 10vw, 9rem)', lineHeight: 1,
                color: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                top: '-0.15em', right: '-0.05em', transition: 'color 350ms ease',
                userSelect: 'none', pointerEvents: 'none',
              }}>
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

    </section>
  );
}
