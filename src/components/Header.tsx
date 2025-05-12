
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Rocket, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookingDialog } from '@/components/BookingDialog';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: t('nav.home'), href: '#' },
    { label: t('nav.courses'), href: '#courses' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-spaceteens-blue via-spaceteens-blue/95 to-spaceteens-lightblue/90 sticky top-0 z-50 shadow-lg">
      {/* Space decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/2 right-1/4 w-2 h-2 rounded-full bg-white/70 shadow-lg shadow-white/50 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between relative z-10">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <div className="relative">
              <img 
                src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
                alt="Spaceteens Academy Logo" 
                className="h-14 w-14 md:h-16 md:w-16 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-spaceteens-orange/30 blur-sm rounded-full"></div>
            </div>
            <div className="ml-2 relative">
              <span className="text-xl md:text-2xl font-bold text-white ml-2 drop-shadow-md">Spaceteens</span>
              <Star className="absolute -top-1 -right-2 w-3 h-3 text-spaceteens-orange animate-pulse-slow" />
            </div>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-8">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="text-white hover:text-spaceteens-orange font-semibold transition-colors duration-300 relative py-2"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-spaceteens-orange transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/admin/login" 
                    className="text-white hover:text-spaceteens-orange font-semibold transition-colors duration-300 relative py-2"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </nav>

            <BookingDialog />

            <button 
              onClick={toggleLanguage}
              className="p-2 text-white hover:text-spaceteens-orange transition-colors duration-300 flex items-center hover:bg-white/10 rounded-full"
            >
              <Globe className="w-5 h-5 mr-1" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={toggleLanguage}
              className="p-2 text-white hover:text-spaceteens-orange transition-colors duration-300"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 text-white hover:text-spaceteens-orange transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-4 bg-spaceteens-blue/90 backdrop-blur-sm rounded-lg mt-2 shadow-lg border border-white/10 relative z-10">
            <Sparkles className="absolute top-2 right-2 h-4 w-4 text-spaceteens-orange animate-pulse-slow" />
            <ul className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="block text-white hover:text-spaceteens-orange font-semibold transition-colors duration-300 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link 
                  to="/admin/login" 
                  className="block text-white hover:text-spaceteens-orange font-semibold transition-colors duration-300 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
              <li className="px-4 pt-2">
                <BookingDialog triggerComponent={
                  <Button 
                    className="w-full bg-spaceteens-orange hover:bg-orange-600 transition-colors duration-300 rounded-full group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Rocket className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    {t('nav.bookNow')}
                  </Button>
                } />
              </li>
            </ul>
          </nav>
        )}

        {/* Shooting star effect */}
        <div className="absolute top-0 right-1/4 h-px w-10 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 animate-pulse-slow"></div>
      </div>
    </header>
  );
};

export default Header;
