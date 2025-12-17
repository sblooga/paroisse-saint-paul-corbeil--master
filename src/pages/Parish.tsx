import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Church, History, Users, Heart, MapPin, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Parish = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('pl') ? 'pl' : 'fr';

  const features = [
    {
      icon: Church,
      title: currentLang === 'pl' ? 'Miejsce kultu' : 'Lieu de culte',
      description: currentLang === 'pl' 
        ? 'Piękny kościół w sercu Moulin-Galant, otwarty dla wszystkich'
        : 'Une belle église au cœur de Moulin-Galant, ouverte à tous',
    },
    {
      icon: Users,
      title: currentLang === 'pl' ? 'Wspólnota' : 'Communauté',
      description: currentLang === 'pl'
        ? 'Żywa wspólnota francusko-polska, zjednoczona w wierze'
        : 'Une communauté franco-polonaise vivante, unie dans la foi',
    },
    {
      icon: Heart,
      title: currentLang === 'pl' ? 'Solidarność' : 'Solidarité',
      description: currentLang === 'pl'
        ? 'Działania charytatywne i wzajemna pomoc'
        : 'Actions caritatives et entraide entre paroissiens',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-primary/5 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="container-parish relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <Church size={18} />
                <span>{currentLang === 'pl' ? 'Nasza Parafia' : 'Notre Paroisse'}</span>
              </div>
              <h1 className="text-foreground mb-6">
                {currentLang === 'pl' 
                  ? 'Parafia Świętego Pawła'
                  : 'Paroisse Saint-Paul'}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentLang === 'pl'
                  ? 'Wspólnota katolicka w Moulin-Galant, Corbeil-Essonnes. Miejsce modlitwy, spotkań i braterstwa dla wspólnot francuskiej i polskiej.'
                  : 'Communauté catholique de Moulin-Galant, Corbeil-Essonnes. Un lieu de prière, de rencontre et de fraternité pour les communautés française et polonaise.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding">
          <div className="container-parish">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-parish p-8 text-center group hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-parish">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-8">
                <History className="text-primary" size={32} />
                <h2 className="text-foreground">
                  {currentLang === 'pl' ? 'Historia parafii' : 'Histoire de la paroisse'}
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {currentLang === 'pl' ? (
                  <>
                    <p>
                      Parafia Świętego Pawła w Moulin-Galant ma bogatą historię sięgającą wielu dziesięcioleci. 
                      Położona w malowniczej dzielnicy Corbeil-Essonnes, nasza parafia zawsze była miejscem 
                      spotkań i duchowego wzrostu dla mieszkańców regionu.
                    </p>
                    <p>
                      Szczególną cechą naszej wspólnoty jest jej dwukulturowy charakter. Od lat gościmy zarówno 
                      wiernych francuskojęzycznych, jak i członków polskiej wspólnoty, tworząc unikalną przestrzeń 
                      braterstwa i wymiany między kulturami.
                    </p>
                    <p>
                      Dziś nasza parafia kontynuuje swoją misję ewangelizacji i służby, organizując regularne 
                      nabożeństwa w obu językach, spotkania formacyjne, działania charytatywne oraz wydarzenia 
                      integrujące obie wspólnoty.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      La paroisse Saint-Paul de Moulin-Galant possède une riche histoire qui remonte à plusieurs 
                      décennies. Située dans le quartier pittoresque de Corbeil-Essonnes, notre paroisse a toujours 
                      été un lieu de rassemblement et de croissance spirituelle pour les habitants de la région.
                    </p>
                    <p>
                      Une caractéristique particulière de notre communauté est son caractère biculturel. Depuis 
                      de nombreuses années, nous accueillons aussi bien les fidèles francophones que les membres 
                      de la communauté polonaise, créant un espace unique de fraternité et d'échange entre les cultures.
                    </p>
                    <p>
                      Aujourd'hui, notre paroisse poursuit sa mission d'évangélisation et de service, en organisant 
                      des offices réguliers dans les deux langues, des rencontres de formation, des actions caritatives 
                      et des événements qui réunissent les deux communautés.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Location & Info */}
        <section className="section-padding">
          <div className="container-parish">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-foreground mb-6">
                  {currentLang === 'pl' ? 'Informacje praktyczne' : 'Informations pratiques'}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        {currentLang === 'pl' ? 'Adres' : 'Adresse'}
                      </h4>
                      <p className="text-muted-foreground">
                        118 boulevard John Kennedy<br />
                        Moulin-Galant<br />
                        91100 Corbeil-Essonnes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-foreground mb-1">
                        {currentLang === 'pl' ? 'Godziny otwarcia' : 'Horaires d\'ouverture'}
                      </h4>
                      <p className="text-muted-foreground">
                        {currentLang === 'pl' 
                          ? 'Kościół otwarty podczas mszy i na życzenie'
                          : 'Église ouverte pendant les messes et sur demande'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2635.8!2d2.4847!3d48.6089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDM2JzMyLjAiTiAywrAyOScwNC45IkU!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={currentLang === 'pl' ? 'Lokalizacja parafii' : 'Localisation de la paroisse'}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Parish;
