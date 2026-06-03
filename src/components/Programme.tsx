'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const BOX        = 150;
const SCROLL_MULT = 3;
const EXTRA_HOLD  = 0.25; // extra viewports to hold after animation completes
const ALIGN_ITEMS = ['flex-start', 'center', 'flex-end'] as const;
const TEXT_ALIGN  = ['left',       'center', 'right']    as const;

// TOP path: starts at center-left, goes UP through box tops, reconnects at center between boxes
function buildTopPath(bx: number[], BOX: number): string {
  const Cy = BOX / 2;
  const [b0, b1, b2] = bx;
  return [
    `M ${b0},${Cy}`,
    `L ${b0},0 L ${b0+BOX},0 L ${b0+BOX},${Cy}`,   // box 1 top half
    `L ${b1},${Cy}`,                                  // single connecting line
    `L ${b1},0 L ${b1+BOX},0 L ${b1+BOX},${Cy}`,   // box 2 top half
    `L ${b2},${Cy}`,                                  // single connecting line
    `L ${b2},0 L ${b2+BOX},0 L ${b2+BOX},${Cy}`,   // box 3 top half
  ].join(' ');
}

// BOTTOM path: same length, same timing — goes DOWN through box bottoms
function buildBottomPath(bx: number[], BOX: number): string {
  const Cy = BOX / 2;
  const [b0, b1, b2] = bx;
  return [
    `M ${b0},${Cy}`,
    `L ${b0},${BOX} L ${b0+BOX},${BOX} L ${b0+BOX},${Cy}`, // box 1 bottom half
    `L ${b1},${Cy}`,
    `L ${b1},${BOX} L ${b1+BOX},${BOX} L ${b1+BOX},${Cy}`, // box 2 bottom half
    `L ${b2},${Cy}`,
    `L ${b2},${BOX} L ${b2+BOX},${BOX} L ${b2+BOX},${Cy}`, // box 3 bottom half
  ].join(' ');
}

export default function Programme() {
  const t = useTranslations('programme');
  const phases = t.raw('phases') as Array<{
    number: string; title: string; description: string;
    icon: string; tags: string[];
  }>;

  const [progress, setProgress] = useState(0);
  const [svgW,     setSvgW]     = useState(1100);
  const [pathLen,  setPathLen]   = useState(10000);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rowRef     = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const currentP   = useRef(0);
  const targetP    = useRef(0);
  const rafId      = useRef<number>();

  // Smooth scroll progress via RAF lerp
  useEffect(() => {
    const calcTarget = () => {
      if (!wrapperRef.current) return 0;
      const rect = wrapperRef.current.getBoundingClientRect();
      const vh   = window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / ((SCROLL_MULT - 1) * vh)));
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

  // Track row width
  useEffect(() => {
    const update = () => { if (rowRef.current) setSvgW(rowRef.current.offsetWidth); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Measure path length after path or width changes
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [svgW]);

  const bx = [0, (svgW - BOX) / 2, svgW - BOX];
  const Cy = BOX / 2;

  // Per-element reveal: icon + text fade in as the "pen" reaches them
  const revealAt = (centerX: number) => {
    const f      = centerX / svgW;
    const startP = f * 0.5;
    const endP   = startP + 0.35;
    return Math.max(0, Math.min(1, (progress - startP) / (endP - startP)));
  };

  const topPath    = buildTopPath(bx, BOX);
  const bottomPath = buildBottomPath(bx, BOX);
  const dashOffset = pathLen * (1 - progress);

  return (
    <div ref={wrapperRef} style={{ height: `${(SCROLL_MULT + EXTRA_HOLD) * 100}vh` }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#000', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 80px', overflow: 'hidden',
      }}>

        {/* Heading */}
        <h2 style={{
          textAlign: 'center', marginBottom: '56px',
          fontFamily: 'var(--font-chakra-petch)', fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '0.04em',
          color: '#fff', textTransform: 'uppercase',
        }}>
          {t('heading')}
        </h2>

        {/* Timeline row */}
        <div ref={rowRef} style={{ position: 'relative', marginBottom: '32px' }}>

          {/* SVG — top + bottom paths share identical dashoffset → animate as one */}
          <svg
            width={svgW} height={BOX}
            viewBox={`0 0 ${svgW} ${BOX}`}
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Top path: goes UP through box tops */}
            <path
              ref={pathRef}
              d={topPath}
              stroke="#5b99bd"
              strokeWidth="1"
              fill="none"
              strokeDasharray={pathLen}
              strokeDashoffset={dashOffset}
            />
            {/* Bottom path: same length, same offset → perfect sync */}
            <path
              d={bottomPath}
              stroke="#5b99bd"
              strokeWidth="1"
              fill="none"
              strokeDasharray={pathLen}
              strokeDashoffset={dashOffset}
            />
          </svg>

          {/* Icons — fade in as pen reaches each box */}
          {phases.map((phase, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0,
              left: bx[i], width: BOX, height: BOX,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: revealAt(bx[i] + BOX / 2),
              pointerEvents: 'none',
            }}>
              <Image
                src={phase.icon} alt={phase.title}
                width={52} height={52}
                style={{ opacity: 0.9 }}
              />
            </div>
          ))}
        </div>

        {/* Text */}
        <div style={{ display: 'flex' }}>
          {phases.map((phase, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: ALIGN_ITEMS[i], textAlign: TEXT_ALIGN[i],
              paddingRight: i === 0 ? '24px' : 0,
              paddingLeft:  i === 2 ? '24px' : 0,
              opacity: revealAt(bx[i] + BOX / 2),
            }}>
              <p style={{ fontFamily: 'var(--font-chakra-petch)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                {phase.number}
              </p>
              <h3 style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', letterSpacing: '0.02em', color: '#fff', lineHeight: 1.1, marginBottom: '14px' }}>
                {phase.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: '300px', marginBottom: '18px' }}>
                {phase.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: ALIGN_ITEMS[i] }}>
                {phase.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--font-chakra-petch)', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: progress < 0.05 ? 1 : 0, transition: 'opacity 400ms ease' }}>
          <p style={{ fontFamily: 'var(--font-chakra-petch)', fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Scroll to explore
          </p>
        </div>
      </div>
    </div>
  );
}
