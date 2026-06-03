import { HeroProvider } from '@/contexts/HeroContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Why from '@/components/Why';
import Programme from '@/components/Programme';
import Studio from '@/components/Studio';
import Apply from '@/components/Apply';

export default function Home() {
  return (
    <HeroProvider>
      <main className="bg-black text-white">
        <Navbar />
        <Hero />
        <About />
        <Why />
        <Programme />
        <Studio />
        <Apply />
      </main>
    </HeroProvider>
  );
}
