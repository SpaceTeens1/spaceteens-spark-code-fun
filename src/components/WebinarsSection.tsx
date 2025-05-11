
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Star, Sparkles } from 'lucide-react';

const WebinarsSection = () => {
  const { t } = useLanguage();
  
  const webinars = [
    {
      title: t('webinars.event1'),
      date: 'May 15, 2025',
      time: '4:00 PM - 5:30 PM',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      title: t('webinars.event2'),
      date: 'May 22, 2025',
      time: '4:00 PM - 5:30 PM',
      instructor: 'Prof. Michael Chen'
    },
    {
      title: t('webinars.event3'),
      date: 'May 29, 2025',
      time: '4:00 PM - 5:30 PM',
      instructor: 'Eng. Lara Thompson'
    }
  ];

  return (
    <section className="section-container bg-gradient-to-b from-spaceteens-teal/5 to-spaceteens-blue/20 relative overflow-hidden">
      {/* Space decorative elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-gradient-to-br from-spaceteens-orange to-spaceteens-yellow opacity-20 blur-sm"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-spaceteens-teal to-spaceteens-lightblue opacity-20 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10">
        <h2 className="section-title">{t('webinars.title')}</h2>
        <p className="section-subtitle">{t('webinars.subtitle')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {webinars.map((webinar, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white/80 backdrop-blur-sm relative">
              <div className="h-3 bg-gradient-to-r from-spaceteens-teal to-spaceteens-orange"></div>
              {/* Star decorations */}
              <Star className={`absolute top-4 right-4 h-3 w-3 text-spaceteens-teal opacity-60 animate-pulse-slow`} 
                style={{ animationDelay: `${index * 0.3}s` }} />
              <Star className={`absolute bottom-4 left-4 h-2 w-2 text-spaceteens-orange opacity-60 animate-pulse-slow`}
                style={{ animationDelay: `${index * 0.5 + 0.2}s` }} />
                
              <CardHeader>
                <CardTitle>{webinar.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{webinar.date}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-1">{t('webinars.date')}: {webinar.date}</div>
                <div className="text-sm text-gray-500 mb-1">Time: {webinar.time}</div>
                <div className="text-sm text-gray-500">Instructor: {webinar.instructor}</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-spaceteens-teal hover:bg-teal-600 transition-colors duration-300">
                  Register Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Shooting stars/comets effect */}
      <div className="absolute top-3/4 left-1/4 h-px w-16 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 h-px w-12 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default WebinarsSection;
