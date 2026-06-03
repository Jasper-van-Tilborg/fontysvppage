'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BlueprintSVG from './BlueprintSVG';
import { HERO_PHASES, heroGte, useHeroPhase, type HeroPhase } from '@/contexts/HeroContext';

type Phase = HeroPhase;
const PHASES = HERO_PHASES;
const gte = heroGte;

// ─── Audio (Web Audio API, generated — no files needed) ─────────────────────
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function noise(ctx: AudioContext, dur: number) {
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function sfxClick(ctx: AudioContext) {
  const n = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.4, ctx.currentTime);
  src.connect(g); g.connect(ctx.destination);
  src.start();
}

function sfxBlueprint(ctx: AudioContext) {
  const t = ctx.currentTime;
  // low hum
  const o1 = ctx.createOscillator();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(55, t);
  o1.frequency.linearRampToValueAtTime(95, t + 2.1);
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0, t);
  g1.gain.linearRampToValueAtTime(0.07, t + 0.4);
  g1.gain.setValueAtTime(0.07, t + 1.9);
  g1.gain.linearRampToValueAtTime(0, t + 2.3);
  o1.connect(g1); g1.connect(ctx.destination);
  o1.start(t); o1.stop(t + 2.5);
  // high drawing tone
  const o2 = ctx.createOscillator();
  o2.type = 'sawtooth';
  o2.frequency.setValueAtTime(3200, t);
  o2.frequency.exponentialRampToValueAtTime(700, t + 2.2);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.015, t);
  g2.gain.linearRampToValueAtTime(0, t + 2.3);
  o2.connect(g2); g2.connect(ctx.destination);
  o2.start(t); o2.stop(t + 2.4);
}

function sfxFlash(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx, 0.1);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  src.connect(g); g.connect(ctx.destination);
  src.start(t);
}

function sfxGlitch(ctx: AudioContext) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx, 0.35);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.16, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  src.connect(g); g.connect(ctx.destination);
  src.start(t);
}

function sfxScan(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(1100, t);
  o.frequency.exponentialRampToValueAtTime(180, t + 0.95);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.09, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
  o.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t + 1);
}

function sfxReveal(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(330, t);
  o.frequency.exponentialRampToValueAtTime(660, t + 0.55);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.045, t + 0.1);
  g.gain.setValueAtTime(0.045, t + 0.45);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
  o.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t + 1.2);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Hero() {
  const t = useTranslations('hero');
  const { phase, setPhase } = useHeroPhase();
  const [btnPressed, setBtnPressed] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  // Lock scroll on both html and body until reveal phase
  useEffect(() => {
    const unlocked = gte(phase, 'reveal');
    const lock = unlocked ? '' : 'hidden';
    document.documentElement.style.overflow = lock;
    document.body.style.overflow = lock;
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [phase]);

  function handlePower() {
    if (phase !== 'off') return;

    audioRef.current = getCtx();
    if (audioRef.current) sfxClick(audioRef.current);

    setBtnPressed(true);
    setPhase('powering');

    const schedule: [Phase, number, ((c: AudioContext) => void)?][] = [
      ['blueprint', 280,  sfxBlueprint],
      ['flash',     2550, sfxFlash],
      ['glitch',    3100, sfxGlitch],
      ['border',    3800, sfxScan],
      ['grid',      4620, undefined],
      ['reveal',    5220, sfxReveal],
      ['done',      6900, undefined],
    ];

    schedule.forEach(([p, ms, sfx]) => {
      setTimeout(() => {
        setPhase(p);
        if (sfx && audioRef.current) sfx(audioRef.current);
      }, ms);
    });
  }

  // derived state
  const isOff         = phase === 'off';
  const isPowering    = phase === 'powering';
  const isFlash       = phase === 'flash';
  const isGlitch      = phase === 'glitch';
  const showBorder    = gte(phase, 'border');
  const showGrid      = gte(phase, 'grid');
  const showReveal    = gte(phase, 'reveal');
  const isDone        = gte(phase, 'done');
  const pastFlash     = gte(phase, 'glitch');
  const showBlueprint = gte(phase, 'blueprint') && !gte(phase, 'border');
  // Hide power button during auto-play (phase moved without button press)
  const isAutoPlay    = !btnPressed && gte(phase, 'powering');
  const showPowerBtn  = !gte(phase, 'flash') && !isAutoPlay;
  const showLogo      = gte(phase, 'flash');

  return (
    <section className="relative w-full h-screen bg-black">

      {/* Blueprint SVG — full screen, above everything during blueprint phase */}
      <BlueprintSVG active={showBlueprint} />

      {/* ── LED wall inner area (clipped) ── */}
      <div className="absolute overflow-hidden" style={{ inset: '40px' }}>

        {/* Pixel grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: showGrid ? 1 : 0,
            transition: 'opacity 1200ms ease',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Scan line */}
        {phase === 'border' && (
          <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65) 50%, transparent)',
              animation: 'vpScanDown 0.95s cubic-bezier(0.4,0,0.6,1) forwards',
            }}
          />
        )}

        {/* Glitch overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: isGlitch ? 'vpGlitch 0.7s steps(4) forwards' : 'none',
            backgroundImage: isGlitch
              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`
              : 'none',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Persistent flicker (end state) */}
        {isDone && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-white"
            style={{ animation: 'vpFlicker 7s ease-in-out infinite' }}
          />
        )}

        {/* ── Power toggle ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          style={{
            opacity: showPowerBtn ? 1 : 0,
            transition: 'opacity 350ms ease',
            pointerEvents: showPowerBtn ? 'auto' : 'none',
          }}
        >
          <p
            className="text-white/55 text-[10px] uppercase"
            style={{ fontFamily: 'var(--font-chakra-petch)', letterSpacing: '0.35em' }}
          >
            Virtual Production Minor
          </p>

          {/* iOS-style toggle */}
          <button
            onClick={handlePower}
            disabled={!isOff}
            aria-label="Power on LED wall"
            style={{
              position: 'relative',
              width: '80px',
              height: '46px',
              borderRadius: '23px',
              border: 'none',
              cursor: isOff ? 'pointer' : 'default',
              padding: 0,
              background: btnPressed ? '#34c759' : 'rgba(255,255,255,0.12)',
              boxShadow: btnPressed
                ? '0 0 0 1px rgba(52,199,89,0.4), 0 4px 16px rgba(52,199,89,0.25)'
                : '0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 2px rgba(0,0,0,0.3)',
              transition: 'background 320ms ease, box-shadow 320ms ease',
            }}
          >
            {/* Sliding knob */}
            <div style={{
              position: 'absolute',
              top: '3px',
              left: btnPressed ? 'calc(100% - 43px)' : '3px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)',
              transition: 'left 320ms cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </button>

          <p
            className="text-white/50 uppercase"
            style={{
              fontFamily: 'var(--font-chakra-petch)',
              fontSize: '9px',
              letterSpacing: '0.42em',
            }}
          >
            {isPowering ? 'Initializing...' : 'Power On'}
          </p>
        </div>

        {/* ── Hero content (active) ── */}
        {showLogo && (
          <>
            {/* Logo + headline + subline — vertically centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16">

              {/* Logo */}
              <div style={{
                transform: showReveal ? 'scale(1)' : 'scale(1.15)',
                transition: pastFlash ? 'transform 900ms cubic-bezier(0.16,1,0.3,1)' : 'none',
                filter: undefined,
                animation: isFlash ? 'vpLogoFlash 0.75s ease-out forwards' : 'none',
              }}>
                <Image
                  src="/fontysvplogowit.svg"
                  alt="Virtual Production Minor"
                  width={240}
                  height={130}
                  className="w-[150px] md:w-[200px]"
                  priority
                />
              </div>

              {/* Headline */}
              <h1
                className="mt-10 text-white uppercase"
                style={{
                  fontFamily: 'var(--font-chakra-petch)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)',
                  lineHeight: 1.05,
                  letterSpacing: '0.06em',
                  maxWidth: '950px',
                  opacity: showReveal ? 1 : 0,
                  transform: showReveal ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 800ms ease 100ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 100ms',
                }}
              >
                {t('headline')}
              </h1>

              {/* Subline */}
              <p
                className="mt-5 text-white/50 uppercase"
                style={{
                  fontFamily: 'var(--font-chakra-petch)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.26em',
                  opacity: showReveal ? 1 : 0,
                  transform: showReveal ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 700ms ease 270ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 270ms',
                }}
              >
                {t('subline')}
              </p>
            </div>

            {/* Scroll indicator — pinned to bottom of LED wall */}
            <div
              aria-hidden
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none select-none"
              style={{
                opacity: showReveal ? 1 : 0,
                transform: showReveal ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease 600ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 600ms',
              }}
            >
              {/* Mouse body */}
              <div style={{
                width: '22px',
                height: '36px',
                borderRadius: '11px',
                border: '1px solid rgba(255,255,255,0.35)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '7px',
                overflow: 'hidden',
                animation: 'vpMouseGlow 1.8s ease-in-out infinite',
              }}>
                <div style={{
                  width: '3px',
                  height: '7px',
                  borderRadius: '2px',
                  background: 'rgba(255,255,255,0.75)',
                  animation: 'vpScrollDot 1.8s ease-in-out infinite',
                }} />
              </div>

              {/* Chevrons */}
              <div className="flex flex-col items-center" style={{ gap: '2px', marginTop: '4px' }}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                  style={{ animation: 'vpScrollChevron 1.8s ease-in-out infinite' }}>
                  <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                  style={{ animation: 'vpScrollChevron 1.8s ease-in-out 180ms infinite' }}>
                  <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <p style={{
                fontFamily: 'var(--font-chakra-petch)',
                fontSize: '8px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                Scroll
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── LED wall border frame (outside overflow:hidden) ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: '40px',
          opacity: isOff || isPowering ? 0.07 : showBorder ? 1 : 0,
          transition: 'opacity 500ms ease',
        }}
      >
        <div className="absolute inset-0" style={{
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), inset 0 0 80px rgba(255,255,255,0.02)',
        }} />
        <div className="absolute w-10 h-10" style={{ top: -2, left: -2,    borderTop:    '2px solid rgba(255,255,255,0.55)', borderLeft:   '2px solid rgba(255,255,255,0.55)' }} />
        <div className="absolute w-10 h-10" style={{ top: -2, right: -2,   borderTop:    '2px solid rgba(255,255,255,0.55)', borderRight:  '2px solid rgba(255,255,255,0.55)' }} />
        <div className="absolute w-10 h-10" style={{ bottom: -2, left: -2,  borderBottom: '2px solid rgba(255,255,255,0.55)', borderLeft:   '2px solid rgba(255,255,255,0.55)' }} />
        <div className="absolute w-10 h-10" style={{ bottom: -2, right: -2, borderBottom: '2px solid rgba(255,255,255,0.55)', borderRight:  '2px solid rgba(255,255,255,0.55)' }} />
        <div className="absolute left-0 right-0" style={{ top: '33.33%',  height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute left-0 right-0" style={{ top: '66.66%',  height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute top-0 bottom-0" style={{ left: '50%',    width:  '1px', background: 'rgba(255,255,255,0.03)' }} />
      </div>
    </section>
  );
}
