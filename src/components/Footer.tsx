import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '@/assets/logo.png';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { key: 'massSchedule', href: '#horaires' },
    { key: 'baptism', href: '#' },
    { key: 'wedding', href: '#' },
    { key: 'catechesis', href: '#' },
    { key: 'funerals', href: '#' },
    { key: 'bulletin', href: '#' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-parish section-padding pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImage}
                alt={t('footer.parishName')}
                className="h-12 w-12 object-contain"
              />
              <h3 className="text-xl font-heading font-bold">
                {t('footer.parishName')}
              </h3>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>12 Rue de l'Église<br />75000 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a href="tel:+33123456789" className="hover:text-accent transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href="mailto:contact@paroisse-stpaul.fr" className="hover:text-accent transition-colors">
                  contact@paroisse-stpaul.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Horaires Secrétariat */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">{t('footer.secretariat')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-secondary shrink-0" />
                <span>{t('footer.hours.weekdays')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-secondary shrink-0" />
                <span>{t('footer.hours.saturday')}</span>
              </li>
            </ul>
            <div className="mt-6">
              <a href="#don" className="inline-flex items-center gap-2 btn-accent text-sm py-2 px-4">
                <Heart size={16} />
                {t('footer.donate')}
              </a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-parish py-6 px-4 pb-20 md:pb-6">
          <div className="flex flex-col items-center gap-4 text-sm text-primary-foreground/50">
            <p className="text-center">© {currentYear} {t('footer.parishName')}. {t('footer.rights')}.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" className="hover:text-accent transition-colors">
                {t('footer.legal')}
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                {t('footer.cookies')}
              </a>
              <Link to="/auth" className="hover:text-accent transition-colors">
                {t('footer.admin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;