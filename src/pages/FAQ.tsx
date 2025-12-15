import { motion } from 'framer-motion';
import { HelpCircle, Mail, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Sacrements',
    questions: [
      {
        question: 'Comment préparer un baptême ?',
        answer: 'Pour préparer un baptême, contactez le secrétariat paroissial au moins 3 mois à l\'avance. Une préparation avec l\'équipe baptême est obligatoire. Vous aurez besoin d\'un extrait d\'acte de naissance et de choisir un parrain et/ou une marraine baptisé(e) et confirmé(e).',
      },
      {
        question: 'Quelles sont les étapes pour se marier à l\'église ?',
        answer: 'Prenez contact avec la paroisse au moins un an avant la date souhaitée. Vous suivrez une préparation au mariage comprenant plusieurs rencontres. Les documents nécessaires incluent : extraits d\'acte de naissance, certificats de baptême, et attestation de préparation.',
      },
      {
        question: 'Comment se confesser ?',
        answer: 'Les confessions sont possibles 30 minutes avant chaque messe ou sur rendez-vous auprès d\'un prêtre. N\'hésitez pas à demander si c\'est votre première confession, le prêtre vous guidera.',
      },
      {
        question: 'Comment recevoir le sacrement des malades ?',
        answer: 'Contactez le secrétariat ou directement un prêtre. Ce sacrement peut être donné à domicile, à l\'hôpital ou lors de célébrations communautaires organisées dans l\'année.',
      },
    ],
  },
  {
    title: 'Vie paroissiale',
    questions: [
      {
        question: 'Comment inscrire mon enfant au catéchisme ?',
        answer: 'Les inscriptions se font en septembre pour l\'année scolaire. Le catéchisme est ouvert aux enfants du CE1 au CM2. Contactez le secrétariat ou la responsable de la catéchèse pour plus d\'informations.',
      },
      {
        question: 'Comment rejoindre la chorale ?',
        answer: 'La chorale accueille tous les volontaires, même sans formation musicale ! Les répétitions ont lieu le jeudi soir à 20h30. Contactez le chef de chorale via le secrétariat.',
      },
      {
        question: 'Y a-t-il des activités pour les jeunes ?',
        answer: 'Oui ! Nous proposons l\'aumônerie pour les collégiens et lycéens, des groupes scouts, et diverses activités (retraites, pèlerinages, soirées). Consultez notre page Actualités ou contactez-nous.',
      },
      {
        question: 'Comment devenir bénévole ?',
        answer: 'De nombreux services ont besoin de bénévoles : accueil, fleurissement, entretien, catéchèse, accompagnement des malades... Contactez le secrétariat pour découvrir où vos talents peuvent servir.',
      },
    ],
  },
  {
    title: 'Informations pratiques',
    questions: [
      {
        question: 'Quels sont les horaires des messes ?',
        answer: 'Dimanche : 9h00, 11h00 et 18h30. Samedi : 18h00 (messe anticipée). En semaine : mardi et jeudi à 8h30, mercredi et vendredi à 18h30. Les horaires peuvent varier pendant les fêtes.',
      },
      {
        question: 'L\'église est-elle accessible aux personnes à mobilité réduite ?',
        answer: 'Oui, l\'église dispose d\'une rampe d\'accès et d\'un emplacement réservé. Une boucle magnétique est également disponible pour les malentendants.',
      },
      {
        question: 'Comment faire un don à la paroisse ?',
        answer: 'Vous pouvez donner lors des quêtes, par chèque, par virement ou en ligne sur notre page "Faire un don". Les dons sont déductibles des impôts à hauteur de 66%. Un reçu fiscal vous sera envoyé.',
      },
      {
        question: 'Comment réserver la salle paroissiale ?',
        answer: 'La salle paroissiale peut être réservée pour des événements en lien avec la vie de l\'Église. Contactez le secrétariat pour connaître les disponibilités et les conditions.',
      },
    ],
  },
];

const FAQ = () => {
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
              <h1 className="text-primary-foreground mb-4">Foire Aux Questions</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                Retrouvez les réponses aux questions les plus fréquentes sur la vie 
                de notre paroisse, les sacrements et les démarches administratives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="section-padding">
          <div className="container-parish max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
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
                      value={`${category.title}-${index}`}
                      className="card-parish border-none px-6 data-[state=open]:shadow-lg transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
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
                Vous n'avez pas trouvé votre réponse ?
              </h3>
              <p className="text-muted-foreground mb-6">
                Notre équipe est à votre disposition pour répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="btn-parish">
                  <Mail size={18} />
                  Nous contacter
                </a>
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
