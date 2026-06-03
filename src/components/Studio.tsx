'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Cfg { src: string; w: number; rot: number; }

const CFGS: Cfg[] = [
  { src: '/collage/IMG_1284.JPG',                                        w: 510, rot: -3   },
  { src: '/collage/IMG_1301.JPG',                                        w: 450, rot:  2   },
  { src: '/collage/IMG_1316.JPG',                                        w: 480, rot: -1.5 },
  { src: '/collage/IMG_1412.JPG',                                        w: 415, rot:  4   },
  { src: '/collage/IMG_9213.jpeg',                                       w: 465, rot: -2.5 },
  { src: '/collage/F97D8D35-CA03-4DDD-92C1-0A0EE7E9D757_1_105_c.jpeg', w: 450, rot:  1.5 },
  { src: '/collage/7A0DDFFE-3120-47FA-8298-9EFBAC3834D0_1_105_c.jpeg', w: 530, rot: -2   },
  { src: '/collage/E6618724-3291-4FC2-8224-EA3B7D00D9CD_1_102_o.jpeg', w: 430, rot:  3   },
  { src: '/collage/Media (5).jpeg',                                      w: 465, rot: -1   },
  { src: '/collage/Media (7).jpeg',                                      w: 440, rot:  2.5 },
  { src: '/collage/Image (1).jpeg',                                      w: 415, rot: -3.5 },
];

interface PhysicsState {
  x: number; y: number;
  vx: number; vy: number;
}

const SPEED = 0.3; // px/frame — slow and calm

function randomDirection(): { vx: number; vy: number } {
  const angle = Math.random() * Math.PI * 2;
  return { vx: Math.cos(angle) * SPEED, vy: Math.sin(angle) * SPEED };
}

export default function Studio() {
  const t = useTranslations('studio');

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const physics      = useRef<PhysicsState[]>([]);
  const rafId        = useRef<number>(0);

  // Drag state
  const drag = useRef<{
    idx: number;
    offX: number; offY: number;
    prevX: number; prevY: number;
    vx: number; vy: number;
  } | null>(null);

  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Initialise physics once container is mounted
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const { width: cw, height: ch } = c.getBoundingClientRect();

    physics.current = CFGS.map(cfg => {
      const imgH = Math.round(cfg.w * 0.67);
      const dir  = randomDirection();
      return {
        x:  Math.random() * Math.max(0, cw - cfg.w),
        y:  Math.random() * Math.max(0, ch - imgH),
        vx: dir.vx,
        vy: dir.vy,
      };
    });

    // Apply initial positions directly to DOM
    physics.current.forEach((s, i) => {
      const el = imgRefs.current[i];
      if (el) { el.style.left = `${s.x}px`; el.style.top = `${s.y}px`; }
    });

    const loop = () => {
      const cw = c.offsetWidth;
      const ch = c.offsetHeight;

      physics.current = physics.current.map((s, i) => {
        // Dragged image: position is controlled by mouse events
        if (drag.current?.idx === i) return s;

        const cfg  = CFGS[i];
        const imgH = Math.round(cfg.w * 0.67);
        let { x, y, vx, vy } = s;

        x += vx;
        y += vy;

        if (x < 0)         { x = 0;         vx =  Math.abs(vx); }
        if (x > cw - cfg.w){ x = cw - cfg.w; vx = -Math.abs(vx); }
        if (y < 0)         { y = 0;         vy =  Math.abs(vy); }
        if (y > ch - imgH) { y = ch - imgH; vy = -Math.abs(vy); }

        // Apply directly to DOM — no React state, no re-render
        const el = imgRefs.current[i];
        if (el) {
          el.style.left      = `${x}px`;
          el.style.top       = `${y}px`;
          el.style.transform = `rotate(${cfg.rot + vx * 0.8}deg)`;
        }

        return { x, y, vx, vy };
      });

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  // Global mouse events for drag
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const { idx, offX, offY } = drag.current;

      const newX = e.clientX - rect.left - offX;
      const newY = e.clientY - rect.top  - offY;

      // Track velocity for throw
      drag.current.vx     = e.clientX - drag.current.prevX;
      drag.current.vy     = e.clientY - drag.current.prevY;
      drag.current.prevX  = e.clientX;
      drag.current.prevY  = e.clientY;

      physics.current[idx].x = newX;
      physics.current[idx].y = newY;

      const el = imgRefs.current[idx];
      if (el) { el.style.left = `${newX}px`; el.style.top = `${newY}px`; }
    };

    const onUp = () => {
      if (!drag.current) return;
      const { idx, vx, vy } = drag.current;
      // Normalize throw velocity to SPEED so it matches the other images
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag > 0.1) {
        physics.current[idx].vx = (vx / mag) * SPEED;
        physics.current[idx].vy = (vy / mag) * SPEED;
      } else {
        // If basically no throw, give it a random direction
        const dir = randomDirection();
        physics.current[idx].vx = dir.vx;
        physics.current[idx].vy = dir.vy;
      }
      drag.current = null;
      setDragIdx(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    const el = imgRefs.current[idx];
    if (!containerRef.current || !el) return;

    const rect    = containerRef.current.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();

    drag.current = {
      idx,
      offX:  e.clientX - elRect.left,
      offY:  e.clientY - elRect.top,
      prevX: e.clientX,
      prevY: e.clientY,
      vx: 0, vy: 0,
    };

    // Freeze velocity while dragging
    physics.current[idx].vx = 0;
    physics.current[idx].vy = 0;

    // Bring to front
    imgRefs.current.forEach((el, i) => { if (el) el.style.zIndex = i === idx ? '50' : '10'; });

    setDragIdx(idx);
    void rect; // suppress unused warning
  }, []);

  return (
    <section
      id="studio"
      className="w-full relative"
      style={{ height: '90vh', background: '#000', overflow: 'hidden' }}
    >
      {/* Heading */}
      <div className="absolute top-[80px] left-[80px] z-10 pointer-events-none select-none">
        <p style={{ fontFamily: 'var(--font-chakra-petch)', fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>
          05 — Studio
        </p>
        <h2 style={{ fontFamily: 'var(--font-chakra-petch)', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', letterSpacing: '0.04em', color: '#fff', textTransform: 'uppercase' }}>
          {t('heading')}
        </h2>
      </div>

      {/* Container for physics images */}
      <div ref={containerRef} className="absolute inset-0">
        {CFGS.map((cfg, i) => (
          <div
            key={cfg.src}
            ref={el => { imgRefs.current[i] = el; }}
            onMouseDown={e => onMouseDown(e, i)}
            style={{
              position:  'absolute',
              width:     cfg.w,
              left:      0,
              top:       0,
              transform: `rotate(${cfg.rot}deg)`,
              cursor:    dragIdx === i ? 'grabbing' : 'grab',
              zIndex:    10,
              userSelect: 'none',
              boxShadow: dragIdx === i
                ? '0 24px 60px rgba(0,0,0,0.8)'
                : '0 6px 24px rgba(0,0,0,0.5)',
              transition: 'box-shadow 200ms ease',
            }}
          >
            <Image
              src={cfg.src}
              alt={`VP studio ${i + 1}`}
              width={cfg.w}
              height={Math.round(cfg.w * 0.67)}
              draggable={false}
              style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
