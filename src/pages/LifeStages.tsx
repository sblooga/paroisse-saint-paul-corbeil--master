import { motion } from 'framer-motion';
import { Heart, Mail, Phone, Droplets, BookOpen, Flame, RefreshCw, Church, HelpCircle, HeartHandshake, Flower2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import baptismImg from '@/assets/sacrament-baptism.jpg';
import communionImg from '@/assets/sacrament-communion.jpg';
import confirmationImg from '@/assets/sacrament-confirmation.jpg';
import reconciliationImg from '@/assets/sacrament-reconciliation.jpg';
import marriageImg from '@/assets/sacrament-marriage.jpg';
import vocationImg from '@/assets/sacrament-vocation.jpg';
import anointingImg from '@/assets/sacrament-anointing.jpg';
import funeralsImg from '@/assets/sacrament-funerals.jpg';

const LifeStages = () => {
  const { t } = useTranslation();

  const lifeStages = [
    {
      key: 'baptism',
      icon: Droplets,
      image: baptismImg,
      question: t('lifeStages.items.baptism.question'),
      answer: t('lifeStages.items.baptism.answer'),
    },
    {
      key: 'communion',
      icon: BookOpen,
      image: communionImg,
      question: t('lifeStages.items.communion.question'),
      answer: t('lifeStages.items.communion.answer'),
    },
    {
      key: 'confirmation',
      icon: Flame,
      image: confirmationImg,
      question: t('lifeStages.items.confirmation.question'),
      answer: t('lifeStages.items.confirmation.answer'),
    },
    {
      key: 'reconciliation',
      icon: RefreshCw,
      image: reconciliationImg,
      question: t('lifeStages.items.reconciliation.question'),
      answer: t('lifeStages.items.reconciliation.answer'),
    },
    {
      key: 'marriage',
      icon: Heart,
      image: marriageImg,
      question: t('lifeStages.items.marriage.question'),
      answer: t('lifeStages.items.marriage.answer'),
    },
    {
      key: 'vocation',
      icon: HelpCircle,
      image: vocationImg,
      question: t('lifeStages.items.vocation.question'),
      answer: t('lifeStages.items.vocation.answer'),
    },
    {
      key: 'anointingSick',
      icon: HeartHandshake,
      image: anointingImg,
      question: t('lifeStages.items.anointingSick.question'),
      answer: t('lifeStages.items.anointingSick.answer'),
    },
    {
      key: 'funerals',
      icon: Flower2,
      image: funeralsImg,
      question: t('lifeStages.items.funerals.question'),
      answer: t('lifeStages.items.funerals.answer'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20 px-4">
          <div className="container-parish text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center p-4 bg-accent/20 rounded-full mb-6">
                <Church className="text-accent" size={32} />
              </div>
              <h1 className="text-primary-foreground mb-4">{t('lifeStages.title')}</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                {t('lifeStages.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Life Stages Content */}
        <section className="section-padding">
          <div className="container-parish max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {lifeStages.map((stage, index) => (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={stage.key}
                    className="card-parish border-none px-6 data-[state=open]:shadow-lg transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-dusty-rose/10 flex items-center justify-center flex-shrink-0">
                          <stage.icon className="text-dusty-rose" size={24} />
                        </div>
                        <span className="text-base md:text-lg font-semibold text-dusty-rose">
                          {stage.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-16">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 flex-shrink-0">
                          <img
                            src={stage.image}
                            alt={stage.question}
                            className="w-full h-48 md:h-40 object-cover rounded-xl shadow-md"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {stage.answer}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 text-center p-8 bg-muted rounded-2xl"
            >
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {t('lifeStages.moreQuestions')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('lifeStages.moreQuestionsDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-parish">
                  <Mail size={18} />
                  {t('lifeStages.contactUs')}
                </Link>
                <a href="tel:+33123456789" className="btn-parish-outline">
                  <Phone size={18} />
                  +33 1 23 45 67 89
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default LifeStages;
