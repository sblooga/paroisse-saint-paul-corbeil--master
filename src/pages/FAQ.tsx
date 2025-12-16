import { motion } from 'framer-motion';
import { HelpCircle, Mail, Phone } from 'lucide-react';
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

const FAQ = () => {
  const { t } = useTranslation();

  const faqCategories = [
    {
      title: t('faq.categories.sacraments'),
      key: 'sacraments',
      questions: [
        { question: t('faq.sacraments.q1'), answer: t('faq.sacraments.a1') },
        { question: t('faq.sacraments.q2'), answer: t('faq.sacraments.a2') },
        { question: t('faq.sacraments.q3'), answer: t('faq.sacraments.a3') },
        { question: t('faq.sacraments.q4'), answer: t('faq.sacraments.a4') },
      ],
    },
    {
      title: t('faq.categories.parishLife'),
      key: 'parishLife',
      questions: [
        { question: t('faq.parishLife.q1'), answer: t('faq.parishLife.a1') },
        { question: t('faq.parishLife.q2'), answer: t('faq.parishLife.a2') },
        { question: t('faq.parishLife.q3'), answer: t('faq.parishLife.a3') },
        { question: t('faq.parishLife.q4'), answer: t('faq.parishLife.a4') },
      ],
    },
    {
      title: t('faq.categories.practicalInfo'),
      key: 'practicalInfo',
      questions: [
        { question: t('faq.practicalInfo.q1'), answer: t('faq.practicalInfo.a1') },
        { question: t('faq.practicalInfo.q2'), answer: t('faq.practicalInfo.a2') },
        { question: t('faq.practicalInfo.q3'), answer: t('faq.practicalInfo.a3') },
        { question: t('faq.practicalInfo.q4'), answer: t('faq.practicalInfo.a4') },
      ],
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
                <HelpCircle className="text-accent" size={32} />
              </div>
              <h1 className="text-primary-foreground mb-4">{t('faq.title')}</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                {t('faq.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="section-padding">
          <div className="container-parish max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-lg">
                    {categoryIndex + 1}
                  </span>
                  {category.title}
                </h2>

                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.key}-${index}`}
                      className="card-parish border-none px-6 data-[state=open]:shadow-lg transition-shadow"
                    >
                      <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 text-center p-8 bg-muted rounded-2xl"
            >
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {t('faq.moreQuestions')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('faq.moreQuestionsDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-parish">
                  <Mail size={18} />
                  {t('faq.contactUs')}
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

export default FAQ;