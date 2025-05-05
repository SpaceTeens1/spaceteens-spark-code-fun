
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, Record<Language, string>>;
  t: (key: string) => string;
}

const translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    ar: 'الرئيسية'
  },
  'nav.courses': {
    en: 'Courses',
    ar: 'الدورات'
  },
  'nav.contact': {
    en: 'Contact',
    ar: 'تواصل معنا'
  },
  'nav.bookNow': {
    en: 'Book Now',
    ar: 'احجز الآن'
  },
  
  // Hero Section
  'hero.title': {
    en: 'Where Young Minds Discover Robotics & AI',
    ar: 'حيث يكتشف العقول الشابة الروبوتات والذكاء الاصطناعي'
  },
  'hero.subtitle': {
    en: 'Nurturing innovation and creativity for children aged 6-13',
    ar: 'رعاية الابتكار والإبداع للأطفال من سن 6 إلى 13 عامًا'
  },
  
  // Courses Section
  'courses.title': {
    en: 'Our Courses',
    ar: 'دوراتنا'
  },
  'courses.subtitle': {
    en: 'Explore the amazing creations from our talented students!',
    ar: 'استكشف الإبداعات المذهلة من طلابنا الموهوبين!'
  },
  'courses.robotics.title': {
    en: 'Robotics Fundamentals',
    ar: 'أساسيات الروبوتات'
  },
  'courses.robotics.description': {
    en: 'Learn to build and program robots with hands-on projects',
    ar: 'تعلم بناء وبرمجة الروبوتات من خلال مشاريع عملية'
  },
  'courses.coding.title': {
    en: 'Coding Adventures',
    ar: 'مغامرات البرمجة'
  },
  'courses.coding.description': {
    en: 'Discover the fun of coding through games and interactive activities',
    ar: 'اكتشف متعة البرمجة من خلال الألعاب والأنشطة التفاعلية'
  },
  'courses.ai.title': {
    en: 'AI for Kids',
    ar: 'الذكاء الاصطناعي للأطفال'
  },
  'courses.ai.description': {
    en: 'Introduction to AI concepts through exciting, age-appropriate projects',
    ar: 'مقدمة في مفاهيم الذكاء الاصطناعي من خلال مشاريع مثيرة ومناسبة للعمر'
  },
  'courses.viewDetails': {
    en: 'View Details',
    ar: 'عرض التفاصيل'
  },
  
  // Mission Section
  'mission.title': {
    en: 'Mission & Vision',
    ar: 'المهمة والرؤية'
  },
  'mission.content': {
    en: 'At Spaceteens, we strive to inspire young minds to explore the wonders of Robotics and AI through hands-on learning and creativity.',
    ar: 'في سبيستينز، نسعى إلى إلهام العقول الشابة لاستكشاف عجائب الروبوتات والذكاء الاصطناعي من خلال التعلم العملي والإبداع.'
  },
  
  // Webinars Section
  'webinars.title': {
    en: 'Join Our Webinars',
    ar: 'انضم إلى ندواتنا عبر الإنترنت'
  },
  'webinars.subtitle': {
    en: 'Check out our upcoming webinars to dive deeper into the world of Robotics!',
    ar: 'تحقق من ندواتنا القادمة عبر الإنترنت للتعمق أكثر في عالم الروبوتات!'
  },
  'webinars.event1': {
    en: 'Introduction to Arduino',
    ar: 'مقدمة في أردوينو'
  },
  'webinars.event2': {
    en: 'Building Your First Robot',
    ar: 'بناء روبوتك الأول'
  },
  'webinars.event3': {
    en: 'AI Basics for Children',
    ar: 'أساسيات الذكاء الاصطناعي للأطفال'
  },
  'webinars.date': {
    en: 'Date',
    ar: 'التاريخ'
  },
  
  // Contact Section
  'contact.title': {
    en: 'Book an Appointment',
    ar: 'حجز موعد'
  },
  'contact.subtitle': {
    en: 'Interested in learning more? Drop us a line!',
    ar: 'مهتم بمعرفة المزيد؟ راسلنا!'
  },
  'contact.emailLabel': {
    en: 'Your Email Address',
    ar: 'عنوان بريدك الإلكتروني'
  },
  'contact.sendButton': {
    en: 'Send Your Inquiry',
    ar: 'أرسل استفسارك'
  },
  
  // Footer
  'footer.followUs': {
    en: 'Follow Us',
    ar: 'تابعنا'
  },
  'footer.contact': {
    en: 'Contact',
    ar: 'تواصل معنا'
  },
  'footer.copyright': {
    en: '© 2025 Spaceteens Academy. All rights reserved.',
    ar: '© 2025 أكاديمية سبيستينز. جميع الحقوق محفوظة.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
