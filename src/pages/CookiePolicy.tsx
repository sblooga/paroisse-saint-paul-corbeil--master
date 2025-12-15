import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const CookiePolicy = () => {
  const { i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
            {isFrench ? 'Politique des Cookies' : 'Polityka Cookies'}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Qu\'est-ce qu\'un cookie ?' : 'Czym jest cookie?'}
              </h2>
              <p>
                {isFrench 
                  ? 'Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) lors de votre visite sur notre site. Il permet de mémoriser vos préférences et d\'améliorer votre expérience de navigation.'
                  : 'Cookie to mały plik tekstowy przechowywany na Twoim urządzeniu (komputerze, tablecie, smartfonie) podczas wizyty na naszej stronie. Pozwala zapamiętać Twoje preferencje i poprawić doświadczenie przeglądania.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Types de cookies utilisés' : 'Rodzaje używanych cookies'}
              </h2>
              
              <h3 className="font-semibold text-foreground mt-4 mb-2">
                {isFrench ? 'Cookies essentiels' : 'Cookies niezbędne'}
              </h3>
              <p>
                {isFrench 
                  ? 'Ces cookies sont nécessaires au fonctionnement du site. Ils permettent notamment de mémoriser vos préférences de langue et de thème (clair/sombre).'
                  : 'Te cookies są niezbędne do funkcjonowania strony. Pozwalają m.in. zapamiętać Twoje preferencje językowe i motywu (jasny/ciemny).'}
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2">
                {isFrench ? 'Cookies de préférences' : 'Cookies preferencji'}
              </h3>
              <p>
                {isFrench 
                  ? 'Ces cookies permettent de mémoriser vos choix (comme la langue) pour personnaliser votre expérience.'
                  : 'Te cookies pozwalają zapamiętać Twoje wybory (takie jak język) w celu personalizacji Twojego doświadczenia.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Gestion des cookies' : 'Zarządzanie cookies'}
              </h2>
              <p>
                {isFrench 
                  ? 'Vous pouvez à tout moment modifier vos préférences en matière de cookies. La plupart des navigateurs vous permettent de :'
                  : 'W każdej chwili możesz zmienić swoje preferencje dotyczące cookies. Większość przeglądarek pozwala na:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isFrench ? 'Voir les cookies stockés et les supprimer individuellement' : 'Przeglądanie zapisanych cookies i ich indywidualne usuwanie'}</li>
                <li>{isFrench ? 'Bloquer les cookies tiers' : 'Blokowanie cookies stron trzecich'}</li>
                <li>{isFrench ? 'Bloquer les cookies de sites spécifiques' : 'Blokowanie cookies z określonych stron'}</li>
                <li>{isFrench ? 'Bloquer tous les cookies' : 'Blokowanie wszystkich cookies'}</li>
                <li>{isFrench ? 'Supprimer tous les cookies à la fermeture du navigateur' : 'Usuwanie wszystkich cookies przy zamknięciu przeglądarki'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Durée de conservation' : 'Okres przechowywania'}
              </h2>
              <p>
                {isFrench 
                  ? 'Les cookies de préférences sont conservés pendant 12 mois. Votre consentement à l\'utilisation des cookies est mémorisé pendant cette période.'
                  : 'Cookies preferencji są przechowywane przez 12 miesięcy. Twoja zgoda na używanie cookies jest zapamiętywana przez ten okres.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Contact' : 'Kontakt'}
              </h2>
              <p>
                {isFrench 
                  ? 'Pour toute question concernant notre politique de cookies, n\'hésitez pas à nous contacter via notre formulaire de contact.'
                  : 'W przypadku pytań dotyczących naszej polityki cookies, prosimy o kontakt poprzez formularz kontaktowy.'}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default CookiePolicy;
