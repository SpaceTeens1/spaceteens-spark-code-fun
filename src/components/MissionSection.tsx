
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Sparkles } from 'lucide-react';

const MissionSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-spaceteens-lightblue/10 to-spaceteens-teal/5 relative overflow-hidden">
      {/* Space decorative elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 right-10 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-2/3 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute top-20 left-20 w-28 h-28 rounded-full bg-gradient-to-br from-spaceteens-teal to-spaceteens-lightblue opacity-10 blur-md"></div>
        <div className="absolute bottom-40 right-40 w-36 h-36 rounded-full bg-gradient-to-br from-spaceteens-orange to-spaceteens-yellow opacity-10 blur-md"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative circles */}
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-spaceteens-teal/10 z-0"></div>
              <div className="absolute bottom-10 -right-10 w-32 h-32 rounded-full bg-spaceteens-orange/10 z-0"></div>
              
              {/* Main image */}
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
                  alt="Children playing with robots" 
                  className="w-full"
                />
                {/* Space element overlays */}
                <div className="absolute top-4 right-4 opacity-70">
                  <Star className="h-6 w-6 text-white animate-pulse-slow" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-5xl font-bold text-spaceteens-blue mb-6 relative">
                {t('mission.title')}
                <Sparkles className="absolute -right-8 top-0 h-6 w-6 text-spaceteens-orange animate-pulse-slow" />
              </h2>
              <p className="text-xl leading-relaxed text-gray-700">
                {t('mission.content')}
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="bg-spaceteens-lightblue/20 p-4 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-bold text-spaceteens-blue mb-2">500+</div>
                  <div className="text-gray-700">Happy students</div>
                </div>
                <div className="bg-spaceteens-orange/10 p-4 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-bold text-spaceteens-orange mb-2">50+</div>
                  <div className="text-gray-700">Exciting projects</div>
                </div>
                <div className="bg-spaceteens-teal/10 p-4 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-bold text-spaceteens-teal mb-2">10+</div>
                  <div className="text-gray-700">Experienced instructors</div>
                </div>
                <div className="bg-spaceteens-lightblue/15 p-4 rounded-lg backdrop-blur-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-bold text-spaceteens-blue mb-2">100%</div>
                  <div className="text-gray-700">Learning fun</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shooting star */}
      <div className="absolute top-1/4 right-0 h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow"></div>
    </section>
  );
};

export default MissionSection;
