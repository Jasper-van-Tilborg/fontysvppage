'use client';

import { useState } from 'react';
import About from './About';
import AboutClassic from './AboutClassic';

export default function AboutABWrapper() {
  const [version, setVersion] = useState<'a' | 'b'>('a');

  return (
    <>
      {/* Toggle pill — fixed bottom-right */}
      <div style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
        display: 'flex', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(0,0,0,0.7)',
      }}>
        {(['a', 'b'] as const).map((v, i) => (
          <>
            {i === 1 && <div key="sep" style={{ width: '1px', background: 'rgba(255,255,255,0.18)' }} />}
            <button
              key={v}
              onClick={() => setVersion(v)}
              style={{
                padding: '9px 18px',
                fontFamily: 'var(--font-chakra-petch)',
                fontSize: '9px', letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: version === v ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: version === v ? '#fff' : 'rgba(255,255,255,0.35)',
                border: 'none', cursor: 'pointer',
                transition: 'background 200ms, color 200ms',
              }}
            >
              {`Version ${v.toUpperCase()}`}
            </button>
          </>
        ))}
      </div>

      {version === 'a' ? <AboutClassic /> : <About />}
    </>
  );
}
