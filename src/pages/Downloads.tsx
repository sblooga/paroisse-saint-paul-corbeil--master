import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Downloads = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'fr';

  const content = {
    fr: {
      title: 'Téléchargements',
      subtitle: 'Documents paroissiaux',
      description: 'Retrouvez ici les annonces paroissiales et les bulletins de messe à télécharger.',
      announcements: {
        title: 'Annonces Paroissiales',
        description: 'Les dernières annonces et informations de la paroisse.',
        buttonText: 'Voir les annonces',
      },
      bulletins: {
        title: 'Bulletins de Messe',
        description: 'Les feuilles de messe hebdomadaires et documents liturgiques.',
        buttonText: 'Voir les bulletins',
      },
      instructions: 'Cliquez sur un dossier pour accéder aux documents sur Google Drive.',
    },
    pl: {
      title: 'Pliki do pobrania',
      subtitle: 'Dokumenty parafialne',
      description: 'Znajdziesz tutaj ogłoszenia parafialne i biuletyny mszalne do pobrania.',
      announcements: {
        title: 'Ogłoszenia Parafialne',
        description: 'Najnowsze ogłoszenia i informacje z parafii.',
        buttonText: 'Zobacz ogłoszenia',
      },
      bulletins: {
        title: 'Biuletyny Mszalne',
        description: 'Cotygodniowe kartki mszalne i dokumenty liturgiczne.',
        buttonText: 'Zobacz biuletyny',
      },
      instructions: 'Kliknij folder, aby uzyskać dostęp do dokumentów na Google Drive.',
    },
  };

  const t = content[currentLang];

  // Replace these with your actual Google Drive folder URLs
  const announcementsFolderUrl = 'https://drive.google.com/drive/folders/YOUR_ANNOUNCEMENTS_FOLDER_ID';
  const bulletinsFolderUrl = 'https://drive.google.com/drive/folders/YOUR_BULLETINS_FOLDER_ID';

  const categories = [
    {
      icon: Calendar,
      title: t.announcements.title,
      description: t.announcements.description,
      buttonText: t.announcements.buttonText,
      url: announcementsFolderUrl,
      color: 'bg-primary',
    },
    {
      icon: BookOpen,
      title: t.bulletins.title,
      description: t.bulletins.description,
      buttonText: t.bulletins.buttonText,
      url: bulletinsFolderUrl,
      color: 'bg-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(var(--accent))_0%,_transparent_50%)]" />
          </div>
          
          <div className="container-parish relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Download className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                {t.title}
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                {t.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="section-padding">
          <div className="container-parish max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-muted-foreground text-center mb-12"
            >
              {t.description}
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-parish p-8 text-center"
                >
                  <div className={`inline-flex p-4 ${category.color} rounded-full mb-6`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
                    {category.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6">
                    {category.description}
                  </p>
                  
                  <a
                    href={category.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-parish inline-flex items-center gap-2"
                  >
                    <FileText size={18} />
                    {category.buttonText}
                    <ExternalLink size={16} />
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-muted-foreground text-center mt-12"
            >
              {t.instructions}
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Downloads;
