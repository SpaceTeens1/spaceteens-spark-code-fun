
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src="/lovable-uploads/fc4f4473-476e-4acb-aa0f-a0d8464c80d6.png" 
              alt="Spaceteens Academy Logo" 
              className="h-14 w-14 md:h-16 md:w-16"
            />
            <span className="text-xl md:text-2xl font-bold text-spaceteens-blue ml-2">Spaceteens</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-8">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="text-gray-700 hover:text-spaceteens-orange font-semibold transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/admin/login" 
                    className="text-gray-700 hover:text-spaceteens-orange font-semibold transition-colors duration-300"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </nav>

            <Button className="bg-spaceteens-orange hover:bg-orange-600 transition-colors duration-300">
              <a href="#contact">{t('nav.bookNow')}</a>
            </Button>

            <button 
              onClick={toggleLanguage}
              className="p-2 text-gray-500 hover:text-spaceteens-blue transition-colors duration-300 flex items-center"
            >
              <Globe className="w-5 h-5 mr-1" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={toggleLanguage}
              className="p-2 text-gray-500 hover:text-spaceteens-blue transition-colors duration-300"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-500 hover:text-spaceteens-blue transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="block text-gray-700 hover:text-spaceteens-orange font-semibold transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link 
                  to="/admin/login" 
                  className="block text-gray-700 hover:text-spaceteens-orange font-semibold transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Button 
                  className="w-full bg-spaceteens-orange hover:bg-orange-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <a href="#contact">{t('nav.bookNow')}</a>
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
