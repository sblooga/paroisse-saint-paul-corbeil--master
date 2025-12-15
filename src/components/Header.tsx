import { useState, useEffect } from 'react';
import { Menu, X, Search, Heart, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'La Paroisse', href: isHomePage ? '#paroisse' : '/#paroisse' },
    { name: 'Équipes', href: isHomePage ? '#equipes' : '/#equipes' },
    { name: 'Actualités', href: isHomePage ? '#actualites' : '/#actualites' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: isHomePage ? '#faq' : '/#faq' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container-parish flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link to="/contact" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={14} />
              <span className="hidden sm:inline">Contact</span>
            </Link>
            <a href={isHomePage ? '#don' : '/#don'} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Heart size={14} />
              <span>Faire un don</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-accent transition-colors hover:scale-110 transform"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button className="px-2 py-1 text-xs font-semibold bg-primary-foreground/20 rounded hover:bg-primary-foreground/30 transition-colors">
                FR
              </button>
              <button className="px-2 py-1 text-xs font-semibold hover:bg-primary-foreground/20 rounded transition-colors">
                PL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/95 backdrop-blur-md shadow-soft' 
            : 'bg-transparent'
        }`}
      >
        <div className="container-parish flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://drive.google.com/uc?export=view&id=1qB3YKEBaH-NqMVWCKCHJmPW5vHN3HYVI" 
              alt="Paroisse Saint-Paul"
              className="h-12 w-12 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-heading font-bold text-foreground leading-tight">
                Paroisse Saint-Paul
              </h1>
              <p className="text-xs text-muted-foreground">Communauté catholique</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isExternal = link.href.startsWith('#') || link.href.includes('/#');
              const isActive = link.href === location.pathname;
              
              if (isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-foreground/80 hover:text-primary font-medium transition-colors relative group ${isActive ? 'text-primary' : ''}`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                  </a>
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
              aria-label="Rechercher"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Search size={20} className="text-foreground" />
            </button>
            
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
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => {
                  const isExternal = link.href.startsWith('#') || link.href.includes('/#');
                  
                  if (isExternal) {
                    return (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-xl font-heading font-semibold text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                      >
                        {link.name}
                      </motion.a>
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
                <a href={isHomePage ? '#don' : '/#don'} className="btn-accent w-full text-center">
                  <Heart size={18} />
                  Faire un don
                </a>
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
