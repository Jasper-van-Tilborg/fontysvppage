'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';

export default function AboutClassic() {
  const t = useTranslations('about');

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
        background: '#000', minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center', padding: '120px 80px', overflow: 'hidden',
      }}
    >

      {/* A/B label */}
      <div style={{
        position: 'absolute', top: '24px', right: '24px',
        fontFamily: 'var(--font-chakra-petch)', fontSize: '9px',
        letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.12)',
        padding: '4px 10px', pointerEvents: 'none',
      }}>
        Version A
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '48px', alignItems: 'center', width: '100%' }}>

        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', ...reveal(0) }}>
          <Image
            src="/aboutthismniorimg.jpeg"
            alt="VP studio with LED wall"
            width={1024}
            height={576}
            sizes="55vw"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Text */}
        <div>
          <span style={{
            display: 'block', fontFamily: 'var(--font-chakra-petch)', fontSize: '10px',
            letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
            marginBottom: '24px', ...reveal(0.1),
          }}>
            02 — About
          </span>
          <h2 style={{
            fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
            fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '0.04em',
            color: '#fff', textTransform: 'uppercase', margin: 0, marginBottom: '32px',
            ...reveal(0.2),
          }}>
            {t('heading')}
          </h2>
          <div style={{ width: '48px', height: '1px', background: '#5b99bd', marginBottom: '32px', ...reveal(0.3) }} />
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '1rem', lineHeight: 1.8,
            color: 'rgba(255,255,255,0.6)', margin: 0,
            ...reveal(0.4),
          }}>
            {t('body')}
          </p>
        </div>

      </div>
    </section>
  );
}
