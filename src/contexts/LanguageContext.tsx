
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Translation object type
interface Translations {
  [key: string]: string;
}

// Define the context type
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

// English translations
const enTranslations: Translations = {
  'nav.home': 'Home',
  'nav.courses': 'Courses',
  'nav.contact': 'Contact Us',
  'nav.bookNow': 'Book Now',
  
  'hero.new': 'New and exciting space education',
  'hero.title': 'Space education for future astronauts',
  'hero.subtitle': 'Join our programs and discover the universe with our expert instructors through interactive courses and exciting activities.',
  
  'courses.title': 'Our Space Courses',
  'courses.subtitle': 'Discover the universe with our specialized courses for future space explorers',
  'courses.viewDetails': 'View Details',
  'courses.robotics.title': 'Space Robotics',
  'courses.robotics.description': 'Learn to build and program robots for space exploration missions',
  'courses.coding.title': 'Coding for Space',
  'courses.coding.description': 'Master programming languages used in space mission control systems',
  'courses.ai.title': 'AI in Astronomy',
  'courses.ai.description': 'Explore how artificial intelligence helps analyze astronomical data',
  
  'mission.title': 'Our Mission',
  'mission.subtitle': 'Inspiring the next generation of space explorers',
  'mission.explore.title': 'Explore',
  'mission.explore.description': 'Discover the wonders of the universe through interactive lessons',
  'mission.learn.title': 'Learn',
  'mission.learn.description': 'Gain knowledge from experienced space educators and scientists',
  'mission.innovate.title': 'Innovate',
  'mission.innovate.description': 'Develop creative solutions for future space challenges',
  
  'webinars.title': 'Upcoming Events',
  'webinars.subtitle': 'Join our free webinars and learn from space experts',
  'webinars.date': 'Date',
  'webinars.event1': 'Journey to Mars: The Future of Space Travel',
  'webinars.event2': 'Cosmic Mysteries: Black Holes Explained',
  'webinars.event3': 'Space Technology: From Rockets to Satellites',
  
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Ready to begin your space journey? Get in touch with us today!',
  'contact.name': 'Name',
  'contact.email': 'Email',
  'contact.message': 'Message',
  'contact.submit': 'Send Message',
  
  'footer.rights': 'All rights reserved',
  'footer.about': 'About Us',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  
  // New booking translations
  'booking.title': 'Schedule a Session',
  'booking.description': 'Book a personalized session with our space education experts.',
  'booking.name': 'Name',
  'booking.namePlaceholder': 'Enter your name',
  'booking.email': 'Email',
  'booking.emailPlaceholder': 'your@email.com',
  'booking.date': 'Date',
  'booking.datePlaceholder': 'Select a date',
  'booking.time': 'Time',
  'booking.timePlaceholder': 'Select a time',
  'booking.message': 'Message (Optional)',
  'booking.messagePlaceholder': 'Tell us what you want to discuss...',
  'booking.submit': 'Book Session',
  'booking.submitting': 'Booking...',
};

// Arabic translations
const arTranslations: Translations = {
  'nav.home': 'الرئيسية',
  'nav.courses': 'الدورات',
  'nav.contact': 'اتصل بنا',
  'nav.bookNow': 'احجز الآن',
  
  'hero.new': 'تعليم فضائي جديد ومثير',
  'hero.title': 'تعليم الفضاء لرواد الفضاء المستقبليين',
  'hero.subtitle': 'انضم إلى برامجنا واكتشف الكون مع مدربينا الخبراء من خلال دورات تفاعلية وأنشطة مثيرة.',
  
  'courses.title': 'دوراتنا الفضائية',
  'courses.subtitle': 'اكتشف الكون مع دوراتنا المتخصصة لمستكشفي الفضاء في المستقبل',
  'courses.viewDetails': 'عرض التفاصيل',
  'courses.robotics.title': 'روبوتات الفضاء',
  'courses.robotics.description': 'تعلم بناء وبرمجة الروبوتات لمهمات استكشاف الفضاء',
  'courses.coding.title': 'البرمجة للفضاء',
  'courses.coding.description': 'إتقان لغات البرمجة المستخدمة في أنظمة التحكم بمهمات الفضاء',
  'courses.ai.title': 'الذكاء الاصطناعي في علم الفلك',
  'courses.ai.description': 'استكشف كيف يساعد الذكاء الاصطناعي في تحليل البيانات الفلكية',
  
  'mission.title': 'مهمتنا',
  'mission.subtitle': 'إلهام الجيل القادم من مستكشفي الفضاء',
  'mission.explore.title': 'استكشف',
  'mission.explore.description': 'اكتشف عجائب الكون من خلال دروس تفاعلية',
  'mission.learn.title': 'تعلم',
  'mission.learn.description': 'اكتسب المعرفة من مربي الفضاء والعلماء ذوي الخبرة',
  'mission.innovate.title': 'ابتكر',
  'mission.innovate.description': 'طور حلولاً إبداعية لتحديات الفضاء المستقبلية',
  
  'webinars.title': 'الأحداث القادمة',
  'webinars.subtitle': 'انضم إلى ندواتنا المجانية عبر الإنترنت وتعلم من خبراء الفضاء',
  'webinars.date': 'التاريخ',
  'webinars.event1': 'رحلة إلى المريخ: مستقبل السفر في الفضاء',
  'webinars.event2': 'أسرار الكون: شرح الثقوب السوداء',
  'webinars.event3': 'تكنولوجيا الفضاء: من الصواريخ إلى الأقمار الصناعية',
  
  'contact.title': 'اتصل بنا',
  'contact.subtitle': 'جاهز لبدء رحلتك الفضائية؟ تواصل معنا اليوم!',
  'contact.name': 'الاسم',
  'contact.email': 'البريد الالكتروني',
  'contact.message': 'الرسالة',
  'contact.submit': 'إرسال الرسالة',
  
  'footer.rights': 'جميع الحقوق محفوظة',
  'footer.about': 'من نحن',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.terms': 'شروط الخدمة',
  
  // New booking translations
  'booking.title': 'جدولة جلسة',
  'booking.description': 'احجز جلسة مخصصة مع خبراء تعليم الفضاء لدينا.',
  'booking.name': 'الاسم',
  'booking.namePlaceholder': 'أدخل اسمك',
  'booking.email': 'البريد الإلكتروني',
  'booking.emailPlaceholder': 'بريدك@الإلكتروني.com',
  'booking.date': 'التاريخ',
  'booking.datePlaceholder': 'اختر تاريخاً',
  'booking.time': 'الوقت',
  'booking.timePlaceholder': 'اختر وقتاً',
  'booking.message': 'الرسالة (اختياري)',
  'booking.messagePlaceholder': 'أخبرنا بما تريد مناقشته...',
  'booking.submit': 'احجز الجلسة',
  'booking.submitting': 'جاري الحجز...',
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default language is English
  const [language, setLanguage] = useState<string>('en');

  // Function to get translated text
  const t = (key: string): string => {
    const translations = language === 'en' ? enTranslations : arTranslations;
    return translations[key] || key;
  };

  // Provide the language context to children
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
