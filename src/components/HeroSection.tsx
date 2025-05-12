
import { useLanguage } from '@/contexts/LanguageContext';
import { FireworksButton } from '@/components/FireworksButton';
import { Sparkles, Rocket, Star } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-to-b from-spaceteens-blue via-spaceteens-lightblue/30 to-spaceteens-teal/20 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative space elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Planets and stars */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-spaceteens-orange to-spaceteens-yellow opacity-30 blur-sm"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-spaceteens-teal to-spaceteens-lightblue opacity-20 blur-sm animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        
        {/* Animated rockets */}
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: "1.5s" }}>
          <Rocket className="h-6 w-6 text-spaceteens-orange rotate-45" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float" style={{ animationDelay: "3s" }}>
          <Rocket className="h-4 w-4 text-spaceteens-orange -rotate-45" />
        </div>
        
        {/* More stars */}
        <div className="absolute top-32 left-1/2 animate-pulse-slow">
          <Star className="h-3 w-3 text-white fill-white/80" />
        </div>
        <div className="absolute bottom-48 right-1/3 animate-pulse-slow" style={{ animationDelay: "2s" }}>
          <Star className="h-2 w-2 text-white fill-white/80" />
        </div>
        <div className="absolute top-1/2 right-64 animate-pulse-slow" style={{ animationDelay: "1s" }}>
          <Star className="h-4 w-4 text-white fill-white/80" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="inline-block mb-2 px-4 py-2 rounded-full bg-spaceteens-orange/10 text-spaceteens-orange font-bold">
              <Star className="inline-block mr-1 h-4 w-4 animate-pulse-slow" />
              {t('hero.new')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
              {t('hero.title')}
              <span className="text-spaceteens-orange">!</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 relative drop-shadow-sm">
              {t('hero.subtitle')}
              <span className="absolute -right-4 top-0 text-2xl animate-bounce-light">✨</span>
            </p>
            <FireworksButton className="bg-spaceteens-orange hover:bg-spaceteens-orange/90 transition-all duration-300 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Rocket className="mr-2 h-5 w-5 animate-pulse-slow" />
              <a href="#courses">{t('nav.courses')}</a>
            </FireworksButton>
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
              <div className="absolute -top-20 -right-10 w-12 h-12 rounded-full bg-white/10 blur-md animate-float"></div>
              <div className="absolute -bottom-12 -left-16 w-14 h-14 rounded-full bg-white/10 blur-md animate-float" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shooting stars/comets effect */}
      <div className="absolute top-1/4 left-0 h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow"></div>
      <div className="absolute top-3/4 right-1/4 h-px w-12 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default HeroSection;
