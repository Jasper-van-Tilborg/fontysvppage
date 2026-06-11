import { HeroProvider } from '@/contexts/HeroContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ABSectionsWrapper from '@/components/ABSectionsWrapper';

export default function Home() {
  return (
    <HeroProvider>
      <main className="bg-black text-white">
        <Navbar />
        <Hero />
        <ABSectionsWrapper />
      </main>
    </HeroProvider>
  );
}
