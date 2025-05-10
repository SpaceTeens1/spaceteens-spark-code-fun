
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, Star } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-to-b from-spaceteens-lightpink via-white to-spaceteens-yellow/20 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="inline-block mb-2 px-4 py-2 rounded-full bg-spaceteens-orange/10 text-spaceteens-orange font-bold">
              <Star className="inline-block mr-1 h-4 w-4 animate-pulse-slow" />
              {t('hero.new')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-spaceteens-blue mb-6 leading-tight">
              {t('hero.title')}
              <span className="text-spaceteens-orange">!</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 relative">
              {t('hero.subtitle')}
              <span className="absolute -right-4 top-0 text-2xl animate-bounce-light">✨</span>
            </p>
            <Button className="bg-spaceteens-orange hover:bg-spaceteens-orange/90 transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Rocket className="mr-2 h-5 w-5 animate-pulse-slow" />
              <a href="#courses">{t('nav.courses')}</a>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-10 -left-12 w-20 h-20 bg-spaceteens-teal rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-6 -right-10 w-16 h-16 bg-spaceteens-orange rounded-full opacity-20 animate-float"></div>
              <img 
                src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
                alt="Spaceteens Academy Robot" 
                className="w-72 md:w-96 animate-float relative z-10"
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-200 rounded-full filter blur-xl opacity-40"></div>
              <Sparkles className="absolute top-0 right-0 text-spaceteens-teal animate-pulse-slow h-8 w-8" />
              <Sparkles className="absolute bottom-12 left-0 text-spaceteens-orange animate-pulse-slow h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
