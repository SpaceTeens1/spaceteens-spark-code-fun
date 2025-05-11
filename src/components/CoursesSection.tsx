
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Rocket, Bot, Code, Brain } from 'lucide-react';

const CoursesSection = () => {
  const { t } = useLanguage();
  
  const courses = [
    {
      title: t('courses.robotics.title'),
      description: t('courses.robotics.description'),
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500',
      alt: 'Robotics course image',
      icon: <Bot className="h-6 w-6" />,
      color: 'border-spaceteens-orange'
    },
    {
      title: t('courses.coding.title'),
      description: t('courses.coding.description'),
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=500',
      alt: 'Coding course image',
      icon: <Code className="h-6 w-6" />,
      color: 'border-spaceteens-lightblue'
    },
    {
      title: t('courses.ai.title'),
      description: t('courses.ai.description'),
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=500',
      alt: 'AI course image',
      icon: <Brain className="h-6 w-6" />,
      color: 'border-spaceteens-teal'
    }
  ];

  return (
    <section id="courses" className="section-container bg-gradient-to-b from-white to-spaceteens-lightpink/50">
      <div className="relative mb-8">
        <h2 className="section-title">{t('courses.title')}</h2>
        <p className="section-subtitle">{t('courses.subtitle')}</p>
        <Sparkles className="absolute top-0 right-1/4 text-spaceteens-orange h-6 w-6 animate-pulse-slow" />
        <Sparkles className="absolute bottom-0 left-1/4 text-spaceteens-teal h-5 w-5 animate-float" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {courses.map((course, index) => (
          <Card key={index} className={`fun-card ${course.color} hover:shadow-xl`}>
            <div className="aspect-video overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-spaceteens-blue/40 to-transparent z-10"></div>
              <img 
                src={course.image} 
                alt={course.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-lg z-20">
                {course.icon}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                {course.title}
                <span className="ml-2 text-spaceteens-orange text-sm">★★★★★</span>
              </CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full border-spaceteens-blue text-spaceteens-blue hover:bg-spaceteens-blue hover:text-white rounded-full group transition-all duration-300">
                {t('courses.viewDetails')}
                <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
