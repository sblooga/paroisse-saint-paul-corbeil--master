import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Heart, Facebook, Instagram, Youtube, MessageCircle, Twitter, Linkedin, Github, Globe, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '@/assets/logo.png';
import { supabase } from '@/integrations/supabase/client';
import FlickrIcon from './icons/FlickrIcon';

interface FooterLink {
  id: string;
  label: string;
  label_fr: string | null;
  label_pl: string | null;
  url: string;
}

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
}

const getSocialIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'facebook': return <Facebook size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'youtube': return <Youtube size={size} />;
    case 'whatsapp': return <MessageCircle size={size} />;
    case 'flickr': return <FlickrIcon size={size} />;
    case 'twitter': return <Twitter size={size} />;
    case 'linkedin': return <Linkedin size={size} />;
    case 'github': return <Github size={size} />;
    default: return <Globe size={size} />;
  }
};

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  // Facebook/Flickr can be blocked when opened from an iframe (preview). In production,
  // we prefer opening in a new tab.
  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const externalTarget = isInIframe ? undefined : '_blank';
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [linksRes, socialRes] = await Promise.all([
        supabase
          .from('footer_links')
          .select('id, label, label_fr, label_pl, url')
          .eq('active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('social_links' as any)
          .select('id, name, icon, url')
          .eq('active', true)
          .order('sort_order', { ascending: true })
      ]);
      
      if (linksRes.data) setFooterLinks(linksRes.data);
      if (socialRes.data) setSocialLinks(socialRes.data as unknown as SocialLink[]);
    };
    fetchData();
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
            <div className="flex gap-3 flex-wrap">
              {socialLinks.filter(s => s.url && s.url !== '#').map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={externalTarget}
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 bg-primary-foreground/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {getSocialIcon(social.icon)}
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