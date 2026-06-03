'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import Image from 'next/image';
import { heroGte, useHeroPhase } from '@/contexts/HeroContext';

export default function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { phase } = useHeroPhase();

  const visible = heroGte(phase, 'reveal');

  function switchLocale(next: string) {
    sessionStorage.setItem('vpAutoPlay', '1');
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[80px] py-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 600ms ease 500ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 500ms',
      }}
    >
      {/* VP Logo */}
      <Image
        src="/fontysvplogowit.svg"
        alt="Virtual Production Minor"
        width={72}
        height={40}
        className="w-[52px] md:w-[64px]"
      />

      {/* Language switch */}
      <div
        className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase"
        style={{ fontFamily: 'var(--font-chakra-petch)' }}
      >
        <button
          onClick={() => switchLocale('nl')}
          disabled={isPending}
          className="px-2 py-1 transition-all duration-200"
          style={locale === 'nl'
            ? { color: '#fff', borderBottom: '1px solid #5b99bd' }
            : { color: 'rgba(255,255,255,0.4)' }
          }
          onMouseEnter={e => { if (locale !== 'nl') (e.currentTarget as HTMLButtonElement).style.color = '#5b99bd'; }}
          onMouseLeave={e => { if (locale !== 'nl') (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
        >
          NL
        </button>
        <span className="text-white/20">/</span>
        <button
          onClick={() => switchLocale('en')}
          disabled={isPending}
          className="px-2 py-1 transition-all duration-200"
          style={locale === 'en'
            ? { color: '#fff', borderBottom: '1px solid #5b99bd' }
            : { color: 'rgba(255,255,255,0.4)' }
          }
          onMouseEnter={e => { if (locale !== 'en') (e.currentTarget as HTMLButtonElement).style.color = '#5b99bd'; }}
          onMouseLeave={e => { if (locale !== 'en') (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
        >
          EN
        </button>
      </div>
    </nav>
  );
}
