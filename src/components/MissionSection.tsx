
import { useLanguage } from '@/contexts/LanguageContext';

const MissionSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-spaceteens-yellow/20 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative circles */}
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-spaceteens-teal/10 z-0"></div>
              <div className="absolute bottom-10 -right-10 w-32 h-32 rounded-full bg-spaceteens-orange/10 z-0"></div>
              
              {/* Main image - Updated to show children playing with robots */}
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
                  alt="Children playing with robots" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-5xl font-bold text-spaceteens-blue mb-6">{t('mission.title')}</h2>
              <p className="text-xl leading-relaxed text-gray-700">
                {t('mission.content')}
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="bg-spaceteens-lightblue/50 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-spaceteens-blue mb-2">500+</div>
                  <div className="text-gray-700">Happy students</div>
                </div>
                <div className="bg-spaceteens-yellow/50 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-spaceteens-orange mb-2">50+</div>
                  <div className="text-gray-700">Exciting projects</div>
                </div>
                <div className="bg-spaceteens-teal/10 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-spaceteens-teal mb-2">10+</div>
                  <div className="text-gray-700">Experienced instructors</div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
                  <div className="text-gray-700">Learning fun</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
