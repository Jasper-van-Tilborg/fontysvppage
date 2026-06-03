'use client';

import { useEffect, useState } from 'react';

interface Dims { w: number; h: number }

function Line({
  x1, y1, x2, y2, delay, duration = 500, opacity = 0.35, color,
}: {
  x1: number; y1: number; x2: number; y2: number;
  delay: number; duration?: number; opacity?: number; color?: string;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color ?? `rgba(255,255,255,${opacity})`}
      strokeWidth="0.5"
      strokeDasharray={len}
      strokeDashoffset={len}
      style={{ animation: `vpDrawLine ${duration}ms linear ${delay}ms forwards` }}
    />
  );
}

function Label({
  x, y, delay, anchor = 'start', opacity = 0.28, children,
}: {
  x: number; y: number; delay: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number; children: string;
}) {
  return (
    <text
      x={x} y={y}
      fill={`rgba(255,255,255,${opacity})`}
      fontSize="8.5"
      fontFamily="'Chakra Petch', monospace"
      letterSpacing="1.8"
      textAnchor={anchor}
      style={{ animation: `vpFadeInText 350ms ease ${delay}ms both` }}
    >
      {children}
    </text>
  );
}

export default function BlueprintSVG({ active }: { active: boolean }) {
  const [dims, setDims] = useState<Dims>({ w: 1440, h: 900 });
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (active) setRendered(true);
  }, [active]);

  const { w, h } = dims;
  const pad = 40;
  const cx = w / 2;
  const cy = h / 2;
  const lw = w - pad * 2;
  const lh = h - pad * 2;
  const circ = Math.PI * 32; // circumference of r=16 circle

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 20, opacity: active ? 1 : 0, transition: 'opacity 700ms ease' }}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {rendered && (
        <>
          {/* ── Navbar blueprint ── */}
          {/* Navbar bottom baseline */}
          <Line x1={0} y1={72} x2={w} y2={72} delay={0} duration={500} opacity={0.1} />

          {/* VP logo outline box */}
          <Line x1={80}    y1={18} x2={148}   y2={18} delay={60}  duration={200} opacity={0.5} />
          <Line x1={148}   y1={18} x2={148}   y2={54} delay={130} duration={180} opacity={0.5} />
          <Line x1={148}   y1={54} x2={80}    y2={54} delay={220} duration={200} opacity={0.5} />
          <Line x1={80}    y1={54} x2={80}    y2={18} delay={300} duration={180} opacity={0.5} />
          {/* V shape inside logo box */}
          <Line x1={90}    y1={26} x2={114}   y2={48} delay={360} duration={160} opacity={0.35} />
          <Line x1={138}   y1={26} x2={114}   y2={48} delay={400} duration={160} opacity={0.35} />
          {/* P arc suggestion */}
          <Line x1={120}   y1={26} x2={120}   y2={48} delay={440} duration={140} opacity={0.3} />

          {/* EN box */}
          <Line x1={w-80-62} y1={22} x2={w-80-34} y2={22} delay={80}  duration={160} opacity={0.45} />
          <Line x1={w-80-34} y1={22} x2={w-80-34} y2={50} delay={160} duration={140} opacity={0.45} />
          <Line x1={w-80-34} y1={50} x2={w-80-62} y2={50} delay={230} duration={160} opacity={0.45} />
          <Line x1={w-80-62} y1={50} x2={w-80-62} y2={22} delay={300} duration={140} opacity={0.45} />
          <Label x={w-80-48} y={41} delay={380} anchor="middle" opacity={0.45}>EN</Label>

          {/* Divider */}
          <Line x1={w-80-30} y1={30} x2={w-80-30} y2={42} delay={340} duration={100} opacity={0.25} />

          {/* NL box */}
          <Line x1={w-80-26} y1={22} x2={w-80+2}  y2={22} delay={100} duration={160} opacity={0.45} />
          <Line x1={w-80+2}  y1={22} x2={w-80+2}  y2={50} delay={180} duration={140} opacity={0.45} />
          <Line x1={w-80+2}  y1={50} x2={w-80-26} y2={50} delay={250} duration={160} opacity={0.45} />
          <Line x1={w-80-26} y1={50} x2={w-80-26} y2={22} delay={320} duration={140} opacity={0.45} />
          <Label x={w-80-12} y={41} delay={400} anchor="middle" opacity={0.45}>NL</Label>

          {/* Full-screen center guides */}
          <Line x1={0}  y1={cy} x2={w}  y2={cy} delay={0}   duration={700} opacity={0.08} />
          <Line x1={cx} y1={0}  x2={cx} y2={h}  delay={80}  duration={600} opacity={0.08} />

          {/* LED wall frame — top → right → bottom → left */}
          <Line x1={pad}   y1={pad}   x2={w-pad} y2={pad}   delay={250} duration={600} opacity={0.55} />
          <Line x1={w-pad} y1={pad}   x2={w-pad} y2={h-pad} delay={500} duration={500} opacity={0.55} />
          <Line x1={w-pad} y1={h-pad} x2={pad}   y2={h-pad} delay={750} duration={600} opacity={0.55} />
          <Line x1={pad}   y1={h-pad} x2={pad}   y2={pad}   delay={1000} duration={500} opacity={0.55} />

          {/* Panel seam lines */}
          <Line x1={pad}   y1={pad + lh / 3}   x2={w-pad} y2={pad + lh / 3}   delay={1100} opacity={0.2} />
          <Line x1={pad}   y1={pad + lh * 2/3} x2={w-pad} y2={pad + lh * 2/3} delay={1180} opacity={0.2} />
          <Line x1={cx}    y1={pad}             x2={cx}    y2={h-pad}           delay={1140} opacity={0.18} />

          {/* Corner measurement ticks — TL */}
          <Line x1={pad}     y1={4}      x2={pad}     y2={pad-4}  delay={1050} duration={180} opacity={0.45} />
          <Line x1={4}       y1={pad}    x2={pad-4}   y2={pad}    delay={1050} duration={180} opacity={0.45} />
          {/* TR */}
          <Line x1={w-pad}   y1={4}      x2={w-pad}   y2={pad-4}  delay={1100} duration={180} opacity={0.45} />
          <Line x1={w-pad+4} y1={pad}    x2={w-4}     y2={pad}    delay={1100} duration={180} opacity={0.45} />
          {/* BL */}
          <Line x1={pad}     y1={h-pad+4} x2={pad}    y2={h-4}    delay={1150} duration={180} opacity={0.45} />
          <Line x1={4}       y1={h-pad}   x2={pad-4}  y2={h-pad}  delay={1150} duration={180} opacity={0.45} />
          {/* BR */}
          <Line x1={w-pad}   y1={h-pad+4} x2={w-pad}  y2={h-4}    delay={1200} duration={180} opacity={0.45} />
          <Line x1={w-pad+4} y1={h-pad}   x2={w-4}    y2={h-pad}  delay={1200} duration={180} opacity={0.45} />

          {/* Center logo crosshair */}
          <Line x1={cx-28} y1={cy} x2={cx+28} y2={cy} delay={1280} duration={220} opacity={0.35} />
          <Line x1={cx} y1={cy-28} x2={cx} y2={cy+28} delay={1280} duration={220} opacity={0.35} />
          <circle
            cx={cx} cy={cy} r={16}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.5"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            style={{ animation: `vpDrawLine 420ms linear 1360ms forwards` }}
          />

          {/* Panel IDs */}
          <Label x={cx - lw/4} y={pad + lh/6}   delay={1350} anchor="middle" opacity={0.16}>P-01</Label>
          <Label x={cx + lw/4} y={pad + lh/6}   delay={1380} anchor="middle" opacity={0.16}>P-02</Label>
          <Label x={cx - lw/4} y={pad + lh/2}   delay={1410} anchor="middle" opacity={0.16}>P-03</Label>
          <Label x={cx + lw/4} y={pad + lh/2}   delay={1440} anchor="middle" opacity={0.16}>P-04</Label>
          <Label x={cx - lw/4} y={pad + lh*5/6} delay={1470} anchor="middle" opacity={0.16}>P-05</Label>
          <Label x={cx + lw/4} y={pad + lh*5/6} delay={1500} anchor="middle" opacity={0.16}>P-06</Label>

          {/* Corner labels */}
          <Label x={pad + 10}   y={pad + 18}  delay={1550} opacity={0.38}>LED WALL · VIRTUAL PRODUCTION STUDIO</Label>
          <Label x={w-pad - 10} y={pad + 18}  delay={1620} anchor="end" opacity={0.28}>10M × 3.5M · EINDHOVEN</Label>
          <Label x={pad + 10}   y={h-pad - 12} delay={1690} opacity={0.24}>FONTYS UNIVERSITY OF APPLIED SCIENCES</Label>
          <Label x={w-pad - 10} y={h-pad - 12} delay={1760} anchor="end" opacity={0.24}>VP-001 · REV 1.0</Label>

          {/* Status */}
          <Label x={cx} y={pad - 16} delay={1850} anchor="middle" opacity={0.45}>SYSTEM ONLINE</Label>

        </>
      )}
    </svg>
  );
}
