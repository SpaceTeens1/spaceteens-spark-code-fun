
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CoursesSection = () => {
  const { t } = useLanguage();
  
  const courses = [
    {
      title: t('courses.robotics.title'),
      description: t('courses.robotics.description'),
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500',
      alt: 'Robotics course image'
    },
    {
      title: t('courses.coding.title'),
      description: t('courses.coding.description'),
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=500',
      alt: 'Coding course image'
    },
    {
      title: t('courses.ai.title'),
      description: t('courses.ai.description'),
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=500',
      alt: 'AI course image'
    }
  ];

  return (
    <section id="courses" className="section-container bg-gradient-to-b from-white to-spaceteens-yellow/20">
      <h2 className="section-title">{t('courses.title')}</h2>
      <p className="section-subtitle">{t('courses.subtitle')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {courses.map((course, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-video overflow-hidden">
              <img 
                src={course.image} 
                alt={course.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full border-spaceteens-blue text-spaceteens-blue hover:bg-spaceteens-blue hover:text-white">
                {t('courses.viewDetails')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
