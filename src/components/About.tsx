'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';

export default function About() {
  const t = useTranslations('about');
  const stats = t.raw('stats') as Array<{ value: string; label: string }>;

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

  const reveal = (delay = 0): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: '#000', height: '100vh',
        display: 'grid', gridTemplateColumns: '55fr 45fr',
        overflow: 'hidden', position: 'relative',
      }}
    >

      {/* A/B label */}
      <div style={{
        position: 'absolute', top: '24px', right: '24px', zIndex: 20,
        fontFamily: 'var(--font-chakra-petch)', fontSize: '9px',
        letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.12)',
        padding: '4px 10px', pointerEvents: 'none',
      }}>
        Version B
      </div>

      {/* ── Left: image ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{
          position: 'relative', width: '100%', height: '70vh', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>
          <Image
            src="/aboutthismniorimg.jpeg"
            alt="VP studio with LED wall"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          {/* edge blend into right panel */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, transparent 65%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── Right: text stack ── */}
      <div style={{
        padding: '0 80px 0 64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>

        {/* Label */}
        <span style={{
          display: 'block', fontFamily: 'var(--font-chakra-petch)', fontSize: '10px',
          letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
          marginBottom: '24px', ...reveal(0),
        }}>
          02 — About
        </span>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
          fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '0.04em',
          color: '#fff', textTransform: 'uppercase', margin: 0, marginBottom: '48px',
          ...reveal(0.1),
        }}>
          {t('heading')}
        </h2>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              borderTop: '1px solid rgba(91,153,189,0.35)',
              paddingTop: '16px',
              ...reveal(0.2 + i * 0.08),
            }}>
              <div style={{
                fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
                fontSize: 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1,
                color: '#5b99bd', marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.75rem',
                lineHeight: 1.4, color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '48px', height: '1px', background: '#5b99bd', marginBottom: '32px', ...reveal(0.5) }} />

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.95rem', lineHeight: 1.85,
          color: 'rgba(255,255,255,0.6)', margin: 0,
          ...reveal(0.6),
        }}>
          {t('body')}
        </p>

      </div>
    </section>
  );
}
