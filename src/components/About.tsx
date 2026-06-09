'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const SLIDES = [
  { src: '/aboutthismniorimg.jpeg', alt: 'VP studio with LED wall' },
];

const SCROLL_MULT = 3;

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
  const [progress, setProgress]   = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
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

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const id = setInterval(() => setActiveSlide(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const dividerOpacity = Math.max(0, Math.min(1, (progress - 0.55) / 0.06));

  return (
    <div ref={wrapperRef} id="about" style={{ height: `${SCROLL_MULT * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#000', display: 'flex', alignItems: 'center', padding: '0 80px', overflow: 'hidden' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '48px', alignItems: 'center', width: '100%' }}>

          {/* Image */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              {SLIDES.map((slide, i) => {
                const isFirst = i === 0;
                return (
                  <div key={slide.src} style={{ position: isFirst ? 'relative' : 'absolute', inset: isFirst ? 'auto' : '0', opacity: i === activeSlide ? 1 : 0, transition: 'opacity 1000ms ease' }}>
                    <Image src={slide.src} alt={slide.alt} width={1024} height={576} sizes="55vw" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text */}
          <div>
            <Typed
              text="02 — About"
              progress={progress}
              start={0.02} end={0.18}
              className="text-white/40 uppercase"
              style={{ display: 'block', fontFamily: 'var(--font-chakra-petch)', fontSize: '10px', letterSpacing: '0.35em', marginBottom: '24px' }}
            />
            <Typed
              text={t('heading')}
              progress={progress}
              start={0.15} end={0.55}
              className="text-white uppercase"
              style={{ display: 'block', fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '0.04em', marginBottom: '32px' }}
            />
            <div style={{ width: '48px', height: '1px', background: '#5b99bd', marginBottom: '32px', opacity: dividerOpacity }} />
            <Typed
              text={t('body')}
              progress={progress}
              start={0.55} end={0.95}
              className="text-white/60"
              style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '1rem', lineHeight: 1.8 }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
