'use client';

import { useTranslations } from 'next-intl';

export default function Apply() {
  const t = useTranslations('apply');

  const checklist = t.raw('checklist') as string[];
  const dl = t.raw('deadlines') as Record<string, string>;

  return (
    <section
      id="apply"
      style={{
        background: '#000',
        padding: '100px 80px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Section label */}
      <p style={{
        fontFamily: 'var(--font-chakra-petch)',
        fontSize: '10px',
        letterSpacing: '0.35em',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        marginBottom: '64px',
      }}>
        06 — Apply
      </p>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'start',
      }}>

        {/* LEFT — This Minor is for you if */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-chakra-petch)',
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            letterSpacing: '0.01em',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '48px',
          }}>
            {t('heading')}
          </h2>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {checklist.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Checkbox */}
                <span style={{
                  flexShrink: 0,
                  width: '28px',
                  height: '28px',
                  border: '1.5px solid #5b99bd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5L5.5 9.5L13 1" stroke="#5b99bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.5,
                }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — Apply */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-chakra-petch)',
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            letterSpacing: '0.01em',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '32px',
          }}>
            Apply
          </h2>

          <p style={{
            fontFamily: 'var(--font-chakra-petch)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Deadlines
          </p>

          {/* Deadline boxes + buttons side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch', marginBottom: '32px' }}>

            {/* Deadline boxes stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: dl.spring, start: dl.springStart, day: dl.springDay, month: dl.springMonth },
                { label: dl.autumn, start: dl.autumnStart, day: dl.autumnDay, month: dl.autumnMonth },
              ].map((d, i) => (
                <div key={i} style={{
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1,
                }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-chakra-petch)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#fff',
                      marginBottom: '3px',
                    }}>
                      {d.label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      {d.start}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      fontFamily: 'var(--font-chakra-petch)',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                      color: '#fff',
                      lineHeight: 1,
                      display: 'block',
                    }}>
                      {d.day}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-chakra-petch)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                    }}>
                      {d.month}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply buttons stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {[
                { label: t('fontysBtn'),   href: 'https://progresswww.nl/fontys',                      target: '_blank' },
                { label: t('externalBtn'), href: 'https://www.kiesopmaat.nl/modules/?org=fontys', target: '_blank' },
              ].map((btn, i) => (
                <a key={i} href={btn.href} target={btn.target} rel="noopener noreferrer" style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '16px 18px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-chakra-petch)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  transition: 'border-color 200ms, background 200ms',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#5b99bd';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(91,153,189,0.07)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }}
                >
                  {btn.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)',
            }}>
              Questions? Get in touch.
            </p>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {t('contactName')}{' '}
              <a
                href={`mailto:${t('contactEmail')}`}
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                {t('contactEmail')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
