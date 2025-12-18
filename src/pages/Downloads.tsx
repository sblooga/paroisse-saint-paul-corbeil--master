import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, FileText, Download, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FolderItem {
  name: string;
  namePl: string;
  url: string;
  children?: FolderItem[];
}

const Downloads = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'fr';
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root']);

  const content = {
    fr: {
      title: 'Téléchargements',
      subtitle: 'Documents paroissiaux',
      description: 'Retrouvez ici les documents de la paroisse. Cliquez sur un dossier pour l\'ouvrir, puis sur un document pour le télécharger.',
      instructions: 'Les documents s\'ouvrent dans Google Drive. Vous pouvez les consulter en ligne ou les télécharger.',
      openFolder: 'Ouvrir dans Google Drive',
    },
    pl: {
      title: 'Pliki do pobrania',
      subtitle: 'Dokumenty parafialne',
      description: 'Znajdziesz tutaj dokumenty parafii. Kliknij folder, aby go otworzyć, a następnie dokument, aby go pobrać.',
      instructions: 'Dokumenty otwierają się w Google Drive. Możesz je przeglądać online lub pobierać.',
      openFolder: 'Otwórz w Google Drive',
    },
  };

  const t = content[currentLang];

  const folderStructure: FolderItem = {
    name: 'Doc Paroisse St. Paul',
    namePl: 'Dokumenty Parafii St. Paul',
    url: 'https://drive.google.com/drive/folders/1aUwQM5-uiI38nphqYmzaBqlyIFrJDpU5',
    children: [
      {
        name: 'Bulletins (Infos)',
        namePl: 'Biuletyny (Informacje)',
        url: 'https://drive.google.com/drive/folders/1cspN3-vFm1gLz2QcG3ihGxAz5CU3H7ha',
      },
      {
        name: 'Bulletins (Messe)',
        namePl: 'Biuletyny (Msza)',
        url: 'https://drive.google.com/drive/folders/1p6L2UDbvqRM7I09bYEusY2ni2LNHJVBP',
      },
      {
        name: 'Docs (Responsables)',
        namePl: 'Dokumenty (Odpowiedzialni)',
        url: 'https://drive.google.com/drive/folders/1Rw3ZZ3wkNHMHXvK-aTcQTFQL_fYj4oJB',
      },
      {
        name: 'Équipes (Pastorale)',
        namePl: 'Zespoły (Duszpasterstwo)',
        url: 'https://drive.google.com/drive/folders/1_tEHHKcF4UaDcUYReHrGcDsSAQ-btXZy',
      },
    ],
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const FolderNode = ({ folder, level = 0 }: { folder: FolderItem; level?: number }) => {
    const isExpanded = expandedFolders.includes(folder.name);
    const hasChildren = folder.children && folder.children.length > 0;
    const displayName = currentLang === 'pl' ? folder.namePl : folder.name;

    return (
      <div className="select-none">
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 group ${level === 0 ? 'bg-card border border-border' : ''}`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {hasChildren ? (
            <button 
              onClick={() => toggleFolder(folder.name)}
              className="p-1 hover:bg-primary/20 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex items-center gap-2 flex-1" onClick={() => hasChildren && toggleFolder(folder.name)}>
            {isExpanded ? (
              <FolderOpen className="w-6 h-6 text-amber-500" />
            ) : (
              <Folder className="w-6 h-6 text-amber-500" />
            )}
            <span className={`font-medium ${level === 0 ? 'text-lg text-foreground' : 'text-foreground'}`}>
              {displayName}
            </span>
          </div>

          <a
            href={folder.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-md text-sm font-medium text-primary transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">{t.openFolder}</span>
          </a>
        </div>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 space-y-1"
          >
            {folder.children!.map((child) => (
              <FolderNode key={child.name} folder={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

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
          <div className="container-parish max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-muted-foreground text-center mb-12"
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-parish p-6"
            >
              <FolderNode folder={folderStructure} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-muted-foreground text-center mt-8"
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
