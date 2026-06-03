'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Why() {
  const t = useTranslations('why');
  const items = t.raw('items') as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  const [inView, setInView] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="w-full"
      style={{ padding: '120px 80px' }}
    >
      <div>

        {/* Heading */}
        <div className="mb-20">
          <p
            className="text-white/40 uppercase mb-4"
            style={{
              fontFamily: 'var(--font-chakra-petch)',
              fontSize: '10px',
              letterSpacing: '0.35em',
              opacity: inView ? 1 : 0,
              transition: 'opacity 600ms ease',
            }}
          >
            03 — Why
          </p>
          <h2
            className="text-white uppercase"
            style={{
              fontFamily: 'var(--font-chakra-petch)',
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)',
              letterSpacing: '0.04em',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 600ms ease 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms',
            }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/10">
          {items.map((item, i) => {
            const hovered = hoveredIdx === i;
            const revealDelay = 150 + i * 100;

            return (
              <div
                key={item.number}
                className="relative p-10 flex flex-col gap-6 overflow-hidden cursor-default"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: '#000000',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 700ms ease ${revealDelay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${revealDelay}ms`,
                }}
              >
                {/* Watermark number */}
                <span
                  aria-hidden
                  className="absolute select-none pointer-events-none"
                  style={{
                    fontFamily: 'var(--font-chakra-petch)',
                    fontWeight: 700,
                    fontSize: 'clamp(6rem, 10vw, 9rem)',
                    lineHeight: 1,
                    color: hovered
                      ? 'rgba(255,255,255,0.14)'
                      : 'rgba(255,255,255,0.06)',
                    top: '-0.15em',
                    right: '-0.05em',
                    transition: 'color 350ms ease',
                  }}
                >
                  {item.number}
                </span>

                {/* Foreground number */}
                <span
                  style={{
                    fontFamily: 'var(--font-chakra-petch)',
                    fontWeight: 700,
                    fontSize: '2.8rem',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: '#5b99bd',
                  }}
                >
                  {item.number}
                </span>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(91,153,189,0.3)' }} />

                {/* Title */}
                <h3
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-chakra-petch)',
                    fontWeight: 700,
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                    color: '#fff',
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-auto"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
