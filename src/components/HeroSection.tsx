
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-to-b from-spaceteens-lightblue to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-spaceteens-blue mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              {t('hero.subtitle')}
            </p>
            <Button className="bg-spaceteens-orange hover:bg-orange-600 transition-colors duration-300 text-lg py-6 px-8">
              <a href="#courses">{t('nav.courses')}</a>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
                alt="Spaceteens Academy Robot" 
                className="w-72 md:w-96 animate-float"
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-200 rounded-full filter blur-xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
