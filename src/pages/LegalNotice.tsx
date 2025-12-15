import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const LegalNotice = () => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
            {isFrench ? 'Mentions Légales' : 'Informacje prawne'}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Éditeur du site' : 'Wydawca strony'}
              </h2>
              <p>
                {isFrench 
                  ? 'Mission Catholique Polonaise de Paris'
                  : 'Polska Misja Katolicka w Paryżu'}
              </p>
              <p>
                {isFrench 
                  ? 'Adresse : [Adresse de la paroisse]'
                  : 'Adres: [Adres parafii]'}
              </p>
              <p>
                {isFrench 
                  ? 'Téléphone : [Numéro de téléphone]'
                  : 'Telefon: [Numer telefonu]'}
              </p>
              <p>
                {isFrench 
                  ? 'Email : [Adresse email]'
                  : 'Email: [Adres email]'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Directeur de publication' : 'Dyrektor publikacji'}
              </h2>
              <p>
                {isFrench 
                  ? '[Nom du responsable]'
                  : '[Imię i nazwisko odpowiedzialnego]'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Hébergement' : 'Hosting'}
              </h2>
              <p>
                {isFrench 
                  ? 'Ce site est hébergé par Lovable / Render.com'
                  : 'Ta strona jest hostowana przez Lovable / Render.com'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Propriété intellectuelle' : 'Własność intelektualna'}
              </h2>
              <p>
                {isFrench 
                  ? 'L\'ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé par le droit d\'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.'
                  : 'Cała zawartość tej strony (teksty, obrazy, filmy itp.) jest chroniona prawem autorskim. Jakiekolwiek powielanie, nawet częściowe, jest zabronione bez uprzedniej zgody.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Responsabilité' : 'Odpowiedzialność'}
              </h2>
              <p>
                {isFrench 
                  ? 'Les informations fournies sur ce site le sont à titre indicatif. La Mission Catholique Polonaise ne saurait être tenue responsable des erreurs ou omissions, ni des résultats qui pourraient être obtenus par l\'usage de ces informations.'
                  : 'Informacje podane na tej stronie mają charakter orientacyjny. Polska Misja Katolicka nie ponosi odpowiedzialności za błędy lub pominięcia, ani za wyniki, które mogą wynikać z wykorzystania tych informacji.'}
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

export default LegalNotice;
