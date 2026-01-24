import { useState, useEffect } from 'react';
import { Menu, X, Search, Heart, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import HashLink from './HashLink';
import SearchDialog from './SearchDialog';
import logoImage from '@/assets/logo.png';
import FlickrIcon from './icons/FlickrIcon';

// WhatsApp icon component
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Dynamic target for external links (avoid iframe blocking in preview)
  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const externalTarget = isInIframe ? undefined : '_blank';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('common.home'), href: '/' },
    { name: t('common.parish'), href: '/paroisse' },
    { name: t('common.lifeStages'), href: '/etapes-de-vie' },
    { name: t('common.team'), href: '/equipe' },
    { name: t('common.schedule'), href: '/horaires' },
    { name: t('common.news'), href: '/articles' },
    { name: t('common.downloads'), href: '/telechargements' },
    { name: t('common.contact'), href: '/contact' },
    { name: t('common.faq'), href: '/faq' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container-parish flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link to="/contact" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={14} />
              <span className="hidden sm:inline">{t('common.contact')}</span>
            </Link>
            <HashLink to={isHomePage ? '#don' : '/#don'} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Heart size={14} />
              <span>{t('common.donate')}</span>
            </HashLink>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/stpaulcorbeil" target={externalTarget} rel="noopener noreferrer" aria-label="Facebook" className="hover:text-accent transition-colors hover:scale-110 transform">
                <Facebook size={16} />
              </a>
              <a href="https://www.youtube.com/@eglise-st.paul-corbeil-essonne" target={externalTarget} rel="noopener noreferrer" aria-label="YouTube" className="hover:text-accent transition-colors hover:scale-110 transform">
                <Youtube size={16} />
              </a>
              <a href="https://www.flickr.com/photos/paroissesaintpaul/albums/" target={externalTarget} rel="noopener noreferrer" aria-label="Flickr" className="hover:text-accent transition-colors hover:scale-110 transform">
                <FlickrIcon size={16} />
              </a>
              <a href="https://wa.me/33986346726" target={externalTarget} rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-accent transition-colors hover:scale-110 transform">
                <WhatsAppIcon size={16} />
              </a>
            </div>
            <LanguageSelector variant="compact" className="ml-4" />
            <div className="ml-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-background ${
          isScrolled 
            ? 'shadow-soft backdrop-blur-md bg-background/98' 
            : ''
        }`}
      >
        <div className="container-parish flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt={t('header.parishName')}
              className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-full shadow-md"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-heading font-bold text-foreground leading-tight">
                {t('header.parishName')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('header.parishSubtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isHash = Boolean((link as any).isHash) || link.href.startsWith('#') || link.href.includes('/#');
              const isActive = link.href === location.pathname;
              
              if (isHash) {
                return (
                  <HashLink
                    key={link.name}
                    to={link.href}
                    className={`text-foreground/80 hover:text-primary font-medium transition-colors relative group ${isActive ? 'text-primary' : ''}`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                  </HashLink>
                );
              }
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-foreground/80 hover:text-primary font-medium transition-colors relative group ${isActive ? 'text-primary' : ''}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('common.search')}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Search size={20} className="text-foreground" />
            </button>
            <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-80 bg-card shadow-2xl z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <LanguageSelector />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => {
                  const isHash = Boolean((link as any).isHash) || link.href.startsWith('#') || link.href.includes('/#');
                  
                  if (isHash) {
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HashLink
                          to={link.href}
                          onClick={() => setIsMenuOpen(false) as any}
                          className="block text-xl font-heading font-semibold text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                        >
                          {link.name}
                        </HashLink>
                      </motion.div>
                    );
                  }
                  
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-xl font-heading font-semibold text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-border">
                <HashLink
                  to={isHomePage ? '#don' : '/#don'}
                  onClick={() => setIsMenuOpen(false) as any}
                  className="btn-accent w-full text-center"
                >
                  <Heart size={18} />
                  {t('common.donate')}
                </HashLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
