import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Baby, Cross, Heart, Sparkles, HandHeart, Users, Flower2, BookHeart, Church, Droplets, Handshake, Star, Crown, Flame, LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeHtml } from '@/lib/sanitize';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

  // Données par défaut basées sur les traductions
  const defaultStages = [
    { icon: 'Droplets', key: 'baptism', image_url: null },
    { icon: 'Sparkles', key: 'communion', image_url: null },
    { icon: 'Flame', key: 'confirmation', image_url: null },
    { icon: 'Handshake', key: 'reconciliation', image_url: null },
    { icon: 'Heart', key: 'marriage', image_url: null },
    { icon: 'Church', key: 'vocation', image_url: null },
    { icon: 'HandHeart', key: 'anointingSick', image_url: null },
    { icon: 'Cross', key: 'funerals', image_url: null },
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
    : defaultStages.map(stage => ({
        ...stage,
        title: t(`lifeStages.items.${stage.key}.question`),
        description: t(`lifeStages.items.${stage.key}.answer`)
      }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('lifeStages.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('lifeStages.description')}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {stages.map((stage, index) => {
                    const IconComponent = iconMap[stage.icon] || Church;
                    const imageUrl = stage.image_url || defaultImages[stage.icon] || baptismImg;
                    
                    return (
                      <AccordionItem 
                        key={stage.id || index} 
                        value={`item-${index}`}
                        className="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {stage.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto">
                              <img
                                src={imageUrl}
                                alt={stage.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 md:w-2/3">
                              <div 
                                className="text-muted-foreground leading-relaxed prose prose-sm max-w-none [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(stage.description) }}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </motion.div>
            )}

            {/* Section Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 text-center bg-primary/5 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                {t('lifeStages.moreQuestions')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('lifeStages.moreQuestionsDesc')}
              </p>
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  {t('lifeStages.contactUs')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LifeStages;
