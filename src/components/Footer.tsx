import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '@/assets/logo.png';
import { supabase } from '@/integrations/supabase/client';
import FlickrIcon from './icons/FlickrIcon';

// WhatsApp icon component
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface FooterLink {
  id: string;
  label: string;
  label_fr: string | null;
  label_pl: string | null;
  url: string;
}

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('footer_links')
        .select('id, label, label_fr, label_pl, url')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (data) setFooterLinks(data);
    };
    fetchLinks();
  }, []);

  const getLinkLabel = (link: FooterLink) => {
    if (i18n.language === 'pl' && link.label_pl) return link.label_pl;
    if (i18n.language === 'fr' && link.label_fr) return link.label_fr;
    return link.label_fr || link.label;
  };

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
                className="h-12 w-12 object-cover rounded-full"
              />
              <h3 className="text-xl font-heading font-bold">
                {t('footer.parishName')}
              </h3>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/stpaulcorbeil" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/@eglise-st.paul-corbeil-essonne" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube size={18} />
              </a>
              <a href="https://www.flickr.com/photos/paroissesaintpaul/albums/" target="_blank" rel="noopener noreferrer" aria-label="Flickr" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <FlickrIcon size={18} />
              </a>
              <a href="https://wa.me/33986346726" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span>118 boulevard John Kennedy<br />Moulin-Galant, 91100 Corbeil-Essonnes</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a href="tel:+33164960901" className="hover:text-accent transition-colors">
                  01 64 96 09 01
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href="mailto:paroissestpaul.corbeil@gmail.com" className="hover:text-accent transition-colors">
                  paroissestpaul.corbeil@gmail.com
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

          <div>
            <h4 className="text-lg font-heading font-bold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => {
                const isExternal = link.url.startsWith('http') || link.url.startsWith('mailto:');
                return (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {getLinkLabel(link)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-parish py-6 px-4 pb-20 md:pb-6">
          <div className="flex flex-col items-center gap-4 text-sm text-primary-foreground/50">
            <p className="text-center">© {currentYear} {t('footer.parishName')}. {t('footer.rights')}.</p>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
              <Link to="/mentions-legales" className="hover:text-accent transition-colors">
                {t('footer.legal')}
              </Link>
              <Link to="/confidentialite" className="hover:text-accent transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/cookies" className="hover:text-accent transition-colors">
                {t('footer.cookies')}
              </Link>
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