import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Baby, Cross, Heart, Sparkles, HandHeart, Users, Flower2, BookHeart, Church, Droplets, Handshake, Star, Crown, Flame, LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Images par défaut pour chaque étape
import baptismImg from '@/assets/sacrament-baptism.jpg';
import communionImg from '@/assets/sacrament-communion.jpg';
import confirmationImg from '@/assets/sacrament-confirmation.jpg';
import marriageImg from '@/assets/sacrament-marriage.jpg';
import reconciliationImg from '@/assets/sacrament-reconciliation.jpg';
import anointingImg from '@/assets/sacrament-anointing.jpg';
import vocationImg from '@/assets/sacrament-vocation.jpg';
import funeralsImg from '@/assets/sacrament-funerals.jpg';

const iconMap: Record<string, LucideIcon> = {
  Baby, Cross, Heart, Sparkles, HandHeart, Users, Flower2, BookHeart, 
  Church, Droplets, Handshake, Star, Crown, Flame
};

const defaultImages: Record<string, string> = {
  Baby: baptismImg,
  Cross: funeralsImg,
  Heart: marriageImg,
  Sparkles: communionImg,
  HandHeart: anointingImg,
  Users: reconciliationImg,
  Flower2: vocationImg,
  BookHeart: confirmationImg,
  Church: baptismImg,
  Droplets: baptismImg,
  Handshake: reconciliationImg,
  Star: confirmationImg,
  Crown: marriageImg,
  Flame: confirmationImg
};

const LifeStages = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const { data: lifeStages, isLoading } = useQuery({
    queryKey: ['lifeStages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('life_stages')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Données par défaut si pas de données en base
  const defaultStages = [
    { icon: 'Droplets', title: t('lifestages.baptism.title'), description: t('lifestages.baptism.description'), image_url: null },
    { icon: 'Sparkles', title: t('lifestages.communion.title'), description: t('lifestages.communion.description'), image_url: null },
    { icon: 'Flame', title: t('lifestages.confirmation.title'), description: t('lifestages.confirmation.description'), image_url: null },
    { icon: 'Heart', title: t('lifestages.marriage.title'), description: t('lifestages.marriage.description'), image_url: null },
    { icon: 'Handshake', title: t('lifestages.reconciliation.title'), description: t('lifestages.reconciliation.description'), image_url: null },
    { icon: 'HandHeart', title: t('lifestages.anointing.title'), description: t('lifestages.anointing.description'), image_url: null },
    { icon: 'Church', title: t('lifestages.vocation.title'), description: t('lifestages.vocation.description'), image_url: null },
    { icon: 'Cross', title: t('lifestages.funerals.title'), description: t('lifestages.funerals.description'), image_url: null },
  ];

  const getLocalizedContent = (stage: any) => {
    if (currentLang === 'pl') {
      return {
        title: stage.title_pl || stage.title,
        description: stage.description_pl || stage.description
      };
    }
    return {
      title: stage.title_fr || stage.title,
      description: stage.description_fr || stage.description
    };
  };

  const stages = lifeStages && lifeStages.length > 0 
    ? lifeStages.map(stage => ({
        ...stage,
        ...getLocalizedContent(stage)
      }))
    : defaultStages;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('lifestages.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('lifestages.subtitle')}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stages.map((stage, index) => {
                  const IconComponent = iconMap[stage.icon] || Church;
                  const imageUrl = stage.image_url || defaultImages[stage.icon] || baptismImg;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={stage.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {stage.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {stage.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LifeStages;
