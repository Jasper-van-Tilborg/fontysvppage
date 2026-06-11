'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';

export default function ApplyNew() {
  const t         = useTranslations('apply');
  const checklist = t.raw('checklist') as string[];
  const dl        = t.raw('deadlines') as Record<string, string>;

  const [visible, setVisible] = useState(false);
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

  const deadlines = [
    { semester: dl.spring, start: dl.springStart, day: dl.springDay, month: dl.springMonth },
    { semester: dl.autumn, start: dl.autumnStart, day: dl.autumnDay, month: dl.autumnMonth },
  ];

  const applyLinks = [
    { label: t('fontysBtn'),   href: 'https://progresswww.nl/fontys' },
    { label: t('externalBtn'), href: 'https://www.kiesopmaat.nl/modules/?org=fontys' },
  ];

  const chakra = 'var(--font-chakra-petch)';
  const inter  = 'var(--font-inter)';

  const reveal = (delay = 0): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="apply"
      style={{
        position: 'relative', overflow: 'hidden', background: '#000',
        padding: '120px 80px', display: 'flex', flexDirection: 'column', gap: '32px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >

      {/* Watermark */}
      <div aria-hidden style={{
        position: 'absolute', left: '50%', bottom: '-0.18em', transform: 'translateX(-50%)',
        fontFamily: chakra, fontWeight: 700, fontSize: '22vw', lineHeight: 1,
        color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.025)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>
        APPLY
      </div>

      {/* Header */}
      <div style={{ zIndex: 1, ...reveal(0) }}>
        <span style={{ display: 'block', fontFamily: chakra, fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>
          06 — Apply
        </span>
        <h2 style={{ fontFamily: chakra, fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', letterSpacing: '0.01em', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
          {t('heading')}
        </h2>
      </div>

      {/* Checklist row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', zIndex: 1 }}>
        {checklist.map((item, i) => (
          <div key={i} style={{
            padding: '22px', border: '1px solid rgba(255,255,255,0.08)',
            background: '#080808',
            display: 'flex', flexDirection: 'column', gap: '14px',
            ...reveal(0.1 + i * 0.05),
          }}>
            <span style={{ width: '28px', height: '28px', border: '1.5px solid #5b99bd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <path d="M1 5L4.5 8.5L12 1" stroke="#5b99bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ fontFamily: inter, fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Deadline cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', zIndex: 1 }}>
        {deadlines.map((d, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', padding: '32px',
            border: '1px solid rgba(255,255,255,0.12)', background: '#080808',
            color: '#fff', position: 'relative', overflow: 'hidden',
            ...reveal(0.3),
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(91,153,189,0.35)' }} />
            <span style={{ fontFamily: chakra, fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {d.semester}
            </span>
            <span style={{ fontFamily: chakra, fontSize: '11px', letterSpacing: '0.18em', color: '#5b99bd', textTransform: 'uppercase', marginBottom: '20px' }}>
              {t('deadlineLabel')}
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px' }}>
              <span style={{ fontFamily: chakra, fontWeight: 700, fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>
                {d.day.padStart(2, '0')}
              </span>
              <span style={{ fontFamily: chakra, fontSize: '0.8rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: '0.4em' }}>
                {d.month}
              </span>
            </div>
            <span style={{ fontFamily: inter, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
              {d.start}
            </span>
          </div>
        ))}
      </div>

      {/* Apply buttons — one shared pair, applies to both deadlines above */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', zIndex: 1 }}>
        {applyLinks.map((link, i) => (
          <a
            key={i} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
              padding: '18px 24px', border: '1px solid rgba(255,255,255,0.18)', background: '#080808',
              textDecoration: 'none', color: '#fff',
              fontFamily: chakra, fontSize: '0.85rem', letterSpacing: '0.04em',
              ...reveal(0.4),
            }}
          >
            {link.label}
            <span style={{ color: '#5b99bd' }}>→</span>
          </a>
        ))}
      </div>

      {/* Contact */}
      <div style={{ zIndex: 1, textAlign: 'center', ...reveal(0.5) }}>
        <p style={{ fontFamily: inter, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          {t('contactName')} ·{' '}
          <a href={`mailto:${t('contactEmail')}`} style={{ color: '#5b99bd', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            {t('contactEmail')}
          </a>
        </p>
      </div>

    </section>
  );
}
