'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const SLIDES = [
  { src: '/aboutthismniorimg.jpeg', alt: 'VP studio with LED wall' },
];

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

export default function About() {
  const t = useTranslations('about');
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const currentP   = useRef(0);
  const targetP    = useRef(0);
  const rafId      = useRef<number>(0);

  useEffect(() => {
    const calcTarget = () => {
      if (!sectionRef.current) return 0;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress 0 = section top at viewport top (section fully in view)
      // Progress 1 = section top 1.5vh above viewport (scrolled well past)
      return Math.max(0, Math.min(1, -rect.top / (1.5 * vh)));
    };
    const onScroll = () => { targetP.current = calcTarget(); };
    const loop = () => {
      currentP.current += (targetP.current - currentP.current) * 0.08;
      setProgress(currentP.current);
      rafId.current = requestAnimationFrame(loop);
    };
    targetP.current = calcTarget();
    rafId.current   = requestAnimationFrame(loop);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const id = setInterval(() => setActiveSlide(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const dividerOpacity = Math.max(0, Math.min(1, (progress - 0.50) / 0.06));

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full"
      style={{ padding: '120px 80px', overflow: 'hidden' }}
    >
      <div className="grid grid-cols-12 gap-x-12 items-center">

        {/* Image — static */}
        <div
          className="col-span-7 relative overflow-hidden"
        >
          <div className="relative w-full">
            {SLIDES.map((slide, i) => {
              const isFirst = i === 0;
              return (
                <div
                  key={slide.src}
                  style={{
                    position: isFirst ? 'relative' : 'absolute',
                    inset: isFirst ? 'auto' : '0',
                    opacity: i === activeSlide ? 1 : 0,
                    transition: 'opacity 1000ms ease',
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1024}
                    height={576}
                    sizes="55vw"
                    className="w-full h-auto block"
                    style={{ display: 'block' }}
                  />
                </div>
              );
            })}
          </div>

          {SLIDES.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: i === activeSlide ? '20px' : '6px',
                    height: '2px',
                    background: i === activeSlide
                      ? 'rgba(255,255,255,0.8)'
                      : 'rgba(255,255,255,0.3)',
                    borderRadius: '1px',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 300ms',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text — typewriter on scroll */}
        <div className="col-span-5">

          <Typed
            text="02 — About"
            progress={progress}
            start={0.02} end={0.15}
            className="text-white/40 uppercase mb-6"
            style={{
              display: 'block',
              fontFamily: 'var(--font-chakra-petch)',
              fontSize: '10px',
              letterSpacing: '0.35em',
            }}
          />

          <Typed
            text={t('heading')}
            progress={progress}
            start={0.12} end={0.50}
            className="text-white uppercase mb-8"
            style={{
              display: 'block',
              fontFamily: 'var(--font-chakra-petch)',
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
            }}
          />

          <div
            style={{
              width: '48px',
              height: '1px',
              background: '#5b99bd',
              marginBottom: '32px',
              opacity: dividerOpacity,
            }}
          />

          <Typed
            text={t('body')}
            progress={progress}
            start={0.50} end={0.95}
            className="text-white/60"
            style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '1rem',
              lineHeight: 1.8,
            }}
          />

        </div>

      </div>
    </section>
  );
}
