
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    // Open email client with prefilled data
    const subject = "Inquiry about Spaceteens Academy";
    const body = `Hello Spaceteens Academy team,\n\nI'm interested in learning more about your programs. Please contact me at: ${email}\n\nThank you!`;
    const mailtoLink = `mailto:Spaceteens.eg@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    
    // Reset form
    setEmail('');
    
    toast({
      title: "Email client opened",
      description: "We've opened your email client to contact us."
    });
  };

  return (
    <section id="contact" className="section-container bg-gradient-to-b from-spaceteens-lightblue/30 to-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">{t('contact.title')}</h2>
        <p className="section-subtitle">{t('contact.subtitle')}</p>
        
        <div className="mt-10">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  {t('contact.emailLabel')}
                </label>
                <Input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-spaceteens-orange hover:bg-orange-600 transition-colors duration-300 py-6 text-lg"
              >
                {t('contact.sendButton')}
              </Button>
            </form>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-spaceteens-lightblue p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-spaceteens-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
                  <p className="mt-1 text-gray-600">+20 107 035 5762</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-spaceteens-yellow p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-spaceteens-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                  <p className="mt-1 text-gray-600">Spaceteens.eg@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
