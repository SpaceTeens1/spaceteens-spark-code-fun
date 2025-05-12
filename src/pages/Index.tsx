
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CoursesSection from '@/components/CoursesSection';
import MissionSection from '@/components/MissionSection';
import WebinarsSection from '@/components/WebinarsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { SpaceElements } from '@/components/SpaceAnimations';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SpaceElements />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CoursesSection />
        <MissionSection />
        <WebinarsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
