
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

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
    <section className="section-container bg-gradient-to-b from-white to-spaceteens-lightblue/30">
      <h2 className="section-title">{t('webinars.title')}</h2>
      <p className="section-subtitle">{t('webinars.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {webinars.map((webinar, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-spaceteens-teal to-spaceteens-orange"></div>
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
    </section>
  );
};

export default WebinarsSection;
